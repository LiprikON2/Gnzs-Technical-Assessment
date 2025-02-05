import { ArrayMinSize, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateLeadResponseExternalDto {
    @IsNumber()
    id: number

    @IsOptional()
    @IsNumber()
    contact_id: number | null

    @IsOptional()
    @IsNumber()
    company_id: number | null

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    request_id: string[]

    @IsBoolean()
    merged: boolean
}
