import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { CreateContactRequestDto } from './dto'
import { ContactsService } from './contacts.service'

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @Post()
    async create(@Body() createContactDto: CreateContactRequestDto) {
        try {
            return await this.contactsService.create(createContactDto)
        } catch (error) {
            throw error
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.contactsService.findOne(+id)
        } catch (error) {
            throw error
        }
    }
}
