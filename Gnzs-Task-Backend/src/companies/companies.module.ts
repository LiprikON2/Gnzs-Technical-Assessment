import { Module } from '@nestjs/common'

import { CompaniesService } from './companies.service'
import { CompaniesController } from './companies.controller'
import { Oauth2Module } from 'src/oauth2/oauth2.module'

@Module({
    imports: [Oauth2Module],
    providers: [CompaniesService],
    controllers: [CompaniesController]
})
export class CompaniesModule {}
