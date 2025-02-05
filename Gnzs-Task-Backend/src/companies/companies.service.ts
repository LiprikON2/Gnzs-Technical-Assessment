import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import { Oauth2Service } from 'src/oauth2/oauth2.service'
import {
    FindCompanyResponseExternalDto,
    CreateCompanyRequestDto,
    CreateCompanyResponseExternalDto
} from './dto'

@Injectable()
export class CompaniesService {
    private readonly logger = new Logger(CompaniesService.name)

    constructor(private readonly oauth2Service: Oauth2Service) {}

    async create(createCompanyDto: CreateCompanyRequestDto): Promise<FindCompanyResponseExternalDto> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const createResponse = await apiClient.post('/api/v4/companies', [createCompanyDto])

            const createCompanyExternal = plainToInstance(
                CreateCompanyResponseExternalDto,
                createResponse.data,
                {
                    enableImplicitConversion: true
                }
            )

            await validateOrReject(createCompanyExternal)

            return await this.findOne(createCompanyExternal._embedded.companies[0].id)
        } catch (error) {
            this.logger.error('Failed to create company', error)

            if (error.response) {
                throw new HttpException(
                    {
                        status: error.response.status,
                        error: error.response.data,
                        message: 'Failed to create company'
                    },
                    error.response.status
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal server error',
                    message: 'Failed to create company'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findOne(id: number): Promise<FindCompanyResponseExternalDto | null> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const response = await apiClient.get(`/api/v4/companies/${id}`)

            const company = plainToInstance(FindCompanyResponseExternalDto, response.data, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true
            })
            await validateOrReject(company)

            return company
        } catch (error) {
            this.logger.error('Failed to find company', error)

            if (error.response) {
                throw new HttpException(
                    {
                        status: error.response.status,
                        error: error.response.data,
                        message: 'Failed to find company'
                    },
                    error.response.status
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal server error',
                    message: 'Failed to find company'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
