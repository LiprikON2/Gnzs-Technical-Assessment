import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { Oauth2Module } from './oauth2/oauth2.module'

@Module({
    imports: [ConfigModule.forRoot(), Oauth2Module],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
