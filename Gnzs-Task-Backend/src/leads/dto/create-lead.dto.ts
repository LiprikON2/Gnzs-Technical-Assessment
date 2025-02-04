import { IsString } from 'class-validator'

export class CreateLeadDto {
    @IsString()
    name: string
}
