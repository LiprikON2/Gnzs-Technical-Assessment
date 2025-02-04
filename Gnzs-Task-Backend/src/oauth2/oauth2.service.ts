import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { catchError, firstValueFrom } from 'rxjs'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

import { TokenResponse } from './types'

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
        if (!this.apiClient) {
            this.apiClient = await this.createAuthorizedClient()
        }
        return this.apiClient
    }

    private async getToken(): Promise<TokenResponse> {
        // ref: https://docs.nestjs.com/techniques/http-module
        const authUrl = process.env.OAUTH_AUTH_URL
        const clientId = process.env.X_CLIENT_ID

        const { data } = await firstValueFrom(
            this.httpService
                .get(authUrl, {
                    headers: {
                        'X-Client-Id': clientId
                    }
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response.data)
                        throw 'An error happened!'
                    })
                )
        )

        return data
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
        // ref: https://axios-http.com/docs/interceptors

        const client = axios.create()

        client.interceptors.request.use(async (config) => {
            const tokens = await this.getValidToken()
            config.headers.Authorization = `Bearer ${tokens.access_token}`
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

                return Promise.reject(error)
            }
        )

        return client
    }
}
