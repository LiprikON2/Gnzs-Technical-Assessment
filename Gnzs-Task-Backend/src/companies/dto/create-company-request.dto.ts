import { IsString } from 'class-validator'

export class CreateCompanyRequestDto {
    @IsString()
    name: string[]
}
