import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'

import { Oauth2Service } from 'src/oauth2/oauth2.service'
import { CreateLeadRequestDto, CreateLeadResponseDto, CreateLeadResponseExternalDto } from './dto'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

@Injectable()
export class LeadsService {
    private readonly logger = new Logger(LeadsService.name)

    constructor(private readonly oauth2Service: Oauth2Service) {}

    async create(createLeadDto: CreateLeadRequestDto): Promise<CreateLeadResponseDto> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const response = await apiClient.post('/api/v4/leads/complex', createLeadDto)

            const leadExternal = plainToInstance(CreateLeadResponseExternalDto, response.data, {
                enableImplicitConversion: true
            }) as unknown as CreateLeadResponseExternalDto[]
            await validateOrReject(leadExternal)

            const lead = {
                id: leadExternal[0].id,
                name: createLeadDto.name[0] ?? ''
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
}
