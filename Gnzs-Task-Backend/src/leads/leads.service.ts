import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import { Oauth2Service } from 'src/oauth2/oauth2.service'
import {
    FindLeadResponseExternalDto,
    CreateLeadRequestDto,
    CreateLeadResponseDto,
    CreateLeadResponseExternalDto
} from './dto'

@Injectable()
export class LeadsService {
    private readonly logger = new Logger(LeadsService.name)

    constructor(private readonly oauth2Service: Oauth2Service) {}

    async create(createLeadDto: CreateLeadRequestDto): Promise<CreateLeadResponseDto> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const createResponse = await apiClient.post('/api/v4/leads/complex', createLeadDto)

            const createLeadExternal = plainToInstance(CreateLeadResponseExternalDto, createResponse.data, {
                enableImplicitConversion: true
            }) as unknown as CreateLeadResponseExternalDto[]

            await validateOrReject(createLeadExternal)

            const findLeadExternal = await this.findOne(createLeadExternal[0].id)

            const lead = {
                id: findLeadExternal.id,
                name: findLeadExternal.name
            }
            await validateOrReject(lead)

            return lead
        } catch (error) {
            this.logger.error('Failed to create lead', error)

            if (error.response) {
                throw new HttpException(
                    {
                        status: error.response.status,
                        error: error.response.data,
                        message: 'Failed to create lead'
                    },
                    error.response.status
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal server error',
                    message: 'Failed to create lead'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findOne(id: number): Promise<FindLeadResponseExternalDto | null> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const response = await apiClient.get(`/api/v4/leads/${id}`)

            const lead = plainToInstance(FindLeadResponseExternalDto, response.data, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true
            })
            await validateOrReject(lead)

            return lead
        } catch (error) {
            this.logger.error('Failed to find lead', error)

            if (error.response) {
                throw new HttpException(
                    {
                        status: error.response.status,
                        error: error.response.data,
                        message: 'Failed to find lead'
                    },
                    error.response.status
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal server error',
                    message: 'Failed to find lead'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
