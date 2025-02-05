import { IsString } from 'class-validator'

export class CreateContactRequestDto {
    @IsString()
    name: string[]
}
