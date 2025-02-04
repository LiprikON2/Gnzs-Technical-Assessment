import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'

import { Oauth2Service } from 'src/oauth2/oauth2.service'
import { CreateLeadDto, LeadDto } from './dto'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

@Injectable()
export class LeadsService {
    private readonly logger = new Logger(LeadsService.name)

    constructor(private readonly oauth2Service: Oauth2Service) {}

    async create(createLeadDto: CreateLeadDto): Promise<LeadDto> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const response = await apiClient.post('/api/v4/leads', createLeadDto)

            const lead = plainToInstance(LeadDto, response.data)

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
}
