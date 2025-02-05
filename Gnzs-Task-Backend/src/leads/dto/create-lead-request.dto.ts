import { ArrayMinSize, IsArray, IsString } from 'class-validator'

export class CreateLeadRequestDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(0)
    name: string[]
}
