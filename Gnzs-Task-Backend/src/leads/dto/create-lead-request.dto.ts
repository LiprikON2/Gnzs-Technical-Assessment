import { IsString } from 'class-validator'

export class CreateLeadRequestDto {
    @IsString()
    name: string[]
}
