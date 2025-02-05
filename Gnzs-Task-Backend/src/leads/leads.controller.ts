import { Body, Controller, Post } from '@nestjs/common'

import { CreateLeadRequestDto } from './dto'
import { LeadsService } from './leads.service'

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    @Post()
    async create(@Body() createLeadDto: CreateLeadRequestDto) {
        try {
            return await this.leadsService.create(createLeadDto)
        } catch (error) {
            throw error
        }
    }
}
