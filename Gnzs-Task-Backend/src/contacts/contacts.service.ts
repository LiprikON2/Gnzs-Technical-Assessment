import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import { Oauth2Service } from 'src/oauth2/oauth2.service'
import {
    FindContactResponseExternalDto,
    CreateContactRequestDto,
    CreateContactResponseExternalDto
} from './dto'

@Injectable()
export class ContactsService {
    private readonly logger = new Logger(ContactsService.name)

    constructor(private readonly oauth2Service: Oauth2Service) {}

    async create(createContactDto: CreateContactRequestDto): Promise<FindContactResponseExternalDto> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const createResponse = await apiClient.post('/api/v4/contacts', [createContactDto])

            const createContactExternal = plainToInstance(
                CreateContactResponseExternalDto,
                createResponse.data,
                {
                    enableImplicitConversion: true
                }
            )

            await validateOrReject(createContactExternal)

            return await this.findOne(createContactExternal._embedded.contacts[0].id)
        } catch (error) {
            this.logger.error('Failed to create contact', error)

            if (error.response) {
                throw new HttpException(
                    {
                        status: error.response.status,
                        error: error.response.data,
                        message: 'Failed to create contact'
                    },
                    error.response.status
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal server error',
                    message: 'Failed to create contact'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findOne(id: number): Promise<FindContactResponseExternalDto | null> {
        try {
            const apiClient = await this.oauth2Service.getApiClient()
            const response = await apiClient.get(`/api/v4/contacts/${id}`)

            const contact = plainToInstance(FindContactResponseExternalDto, response.data, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true
            })
            await validateOrReject(contact)

            return contact
        } catch (error) {
            this.logger.error('Failed to find contact', error)

            if (error.response) {
                throw new HttpException(
                    {
                        status: error.response.status,
                        error: error.response.data,
                        message: 'Failed to find contact'
                    },
                    error.response.status
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal server error',
                    message: 'Failed to find contact'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
