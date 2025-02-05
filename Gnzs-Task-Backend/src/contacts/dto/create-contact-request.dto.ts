import { IsOptional, IsString } from 'class-validator'

export class CreateContactRequestDto {
    @IsString()
    @IsOptional()
    name: string
}
