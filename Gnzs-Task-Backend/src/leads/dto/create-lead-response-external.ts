import { Type } from 'class-transformer'
import { IsString, IsNumber, ValidateNested, IsArray, ArrayMinSize } from 'class-validator'

export class LinkDto {
    @IsString()
    href: string
}

export class LinksDto {
    @ValidateNested()
    @Type(() => LinkDto)
    self: LinkDto
}

export class LeadDto {
    @IsNumber()
    id: number

    @IsString()
    request_id: string

    @ValidateNested()
    @Type(() => LinksDto)
    _links: LinksDto
}

export class EmbeddedDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => LeadDto)
    leads: LeadDto[]
}

export class CreateLeadResponseExternalDto {
    @ValidateNested()
    @Type(() => LinksDto)
    _links: LinksDto

    @ValidateNested()
    @Type(() => EmbeddedDto)
    _embedded: EmbeddedDto
}
