import { Body, Controller, Get, Param, Post } from '@nestjs/common'

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

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.leadsService.findOne(+id)
        } catch (error) {
            throw error
        }
    }
}
