import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { Oauth2Service } from './oauth2.service'

@Module({
    imports: [HttpModule],
    providers: [Oauth2Service],
    exports: [Oauth2Service]
})
export class Oauth2Module {}
