import { Module } from '@nestjs/common'

import { ContactsService } from './contacts.service'
import { ContactsController } from './contacts.controller'
import { Oauth2Module } from 'src/oauth2/oauth2.module'

@Module({
    imports: [Oauth2Module],
    providers: [ContactsService],
    controllers: [ContactsController]
})
export class ContactsModule {}
