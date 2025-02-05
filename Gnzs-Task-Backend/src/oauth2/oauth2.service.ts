import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { catchError, firstValueFrom } from 'rxjs'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

import { TokenResponse } from './types'
import { InvalidClientException, TokenRetrievalException } from './exceptions'

interface RequestWithRetry extends AxiosRequestConfig {
    retried?: boolean
}

@Injectable()
export class Oauth2Service {
    private tokenData: TokenResponse | null = null
    private refreshPromise: Promise<TokenResponse> | null = null
    private apiClient: AxiosInstance | null = null

    private readonly logger = new Logger(Oauth2Service.name)

    constructor(private readonly httpService: HttpService) {}

    async onModuleInit() {
        this.apiClient = await this.createAuthorizedClient()
    }

    async getApiClient(): Promise<AxiosInstance> {
        try {
            if (!this.apiClient) {
                this.apiClient = await this.createAuthorizedClient()
            }
            return this.apiClient
        } catch (error) {
            this.logger.error('Failed to get API client', error)
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Authorization Failed',
                    message: 'Failed to create authorized client'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    private async getToken(): Promise<TokenResponse> {
        // ref: https://docs.nestjs.com/techniques/http-module
        const authUrl = process.env.OAUTH_AUTH_URL
        const clientId = process.env.X_CLIENT_ID

        if (!clientId) {
            this.logger.error('The value of environment variable X_CLIENT_ID must be set')
            throw new InvalidClientException()
        }

        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get(authUrl, {
                        headers: {
                            'X-Client-Id': clientId
                        }
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            if (error.response?.status === 401) {
                                throw new InvalidClientException()
                            }

                            throw new TokenRetrievalException(error.response?.data)
                        })
                    )
            )
            return data
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            this.logger.error('Unexpected error during token retrieval', error)
            throw new TokenRetrievalException(error)
        }
    }

    private async getValidToken(): Promise<TokenResponse> {
        if (!this.tokenData) {
            return this.refreshToken()
        }
        return this.tokenData
    }

    private async refreshToken(): Promise<TokenResponse> {
        if (this.refreshPromise) {
            return this.refreshPromise
        }

        this.refreshPromise = this.getToken()
            .then((tokens) => {
                this.tokenData = tokens
                return tokens
            })
            .finally(() => {
                this.refreshPromise = null
            })

        return this.refreshPromise
    }

    private async createAuthorizedClient(): Promise<AxiosInstance> {
        try {
            const token = await this.getValidToken()
            const client = axios.create({
                baseURL: this.ensureHttps(token.base_domain)
            })

            // ref: https://axios-http.com/docs/interceptors
            client.interceptors.request.use(async (config) => {
                const token = await this.getValidToken()

                config.headers.Authorization = `Bearer ${token.access_token}`
                return config
            })

            client.interceptors.response.use(
                (response) => response,
                async (error: AxiosError) => {
                    // Make a attempt to retry the original request with new tokens
                    const originalRequest = error.config as RequestWithRetry

                    if (
                        (error.response?.status === 401 || error.response?.status === 403) &&
                        !originalRequest.retried
                    ) {
                        originalRequest.retried = true

                        await this.refreshToken()

                        return client(originalRequest)
                    }
                    this.logger.error('Tried to refresh token and failed', error)
                    return Promise.reject(error)
                }
            )
            return client
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new TokenRetrievalException(error)
        }
    }

    private ensureHttps(domain: string): string {
        if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
            domain = `https://${domain}`
        }
        const url = new URL(domain)
        return `https://${url.host}`
    }
}
