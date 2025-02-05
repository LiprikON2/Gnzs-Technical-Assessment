import { IsOptional, IsString } from 'class-validator'

export class CreateCompanyRequestDto {
    @IsString()
    @IsOptional()
    name: string
}
