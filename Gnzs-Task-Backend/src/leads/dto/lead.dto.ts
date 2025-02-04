import { IsNumber, IsString } from 'class-validator'

export class LeadDto {
    @IsNumber()
    id: number

    @IsString()
    name: string
}
