import { HttpException, HttpStatus } from '@nestjs/common'

export class TokenRetrievalException extends HttpException {
    constructor(error?: any) {
        super(
            {
                status: HttpStatus.UNAUTHORIZED,
                error: 'Token Retrieval Failed',
                message: 'Failed to retrieve access token',
                details: error
            },
            HttpStatus.UNAUTHORIZED
        )
    }
}

export class InvalidClientException extends HttpException {
    constructor() {
        super(
            {
                status: HttpStatus.UNAUTHORIZED,
                error: 'Invalid Client',
                message: 'Invalid client credentials'
            },
            HttpStatus.UNAUTHORIZED
        )
    }
}
