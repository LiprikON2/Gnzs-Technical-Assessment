import { IsNumber, IsString } from 'class-validator'

export class CreateLeadResponseDto {
    @IsNumber()
    id: number

    @IsString()
    name: string
}
