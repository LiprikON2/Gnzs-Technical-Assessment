import { IsOptional, IsString } from 'class-validator'

export class CreateLeadRequestDto {
    @IsString()
    @IsOptional()
    name: string
}
