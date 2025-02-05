import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { CreateCompanyRequestDto } from './dto'
import { CompaniesService } from './companies.service'

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    async create(@Body() createCompanyDto: CreateCompanyRequestDto) {
        try {
            return await this.companiesService.create(createCompanyDto)
        } catch (error) {
            throw error
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.companiesService.findOne(+id)
        } catch (error) {
            throw error
        }
    }
}
