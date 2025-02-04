import { Module } from '@nestjs/common'

import { LeadsService } from './leads.service'
import { LeadsController } from './leads.controller'
import { Oauth2Module } from 'src/oauth2/oauth2.module'

@Module({
    imports: [Oauth2Module],
    providers: [LeadsService],
    controllers: [LeadsController]
})
export class LeadsModule {}
