import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule)
        app.useGlobalPipes(new ValidationPipe())
        await app.listen(3000)
    } catch (err) {
        console.error(`Failed to initialize, due to ${err}`)
        process.exit(1)
    }
}
bootstrap()
