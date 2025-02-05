import { Type } from 'class-transformer'
import { IsString, IsNumber, ValidateNested, IsArray, ArrayMinSize, IsBoolean } from 'class-validator'

export class LinkDto {
    @IsString()
    href: string
}

export class LinksDto {
    @ValidateNested()
    @Type(() => LinkDto)
    self: LinkDto
}

export class ContactDto {
    @IsNumber()
    id: number

    @IsString()
    request_id: string

    @IsBoolean()
    is_deleted: boolean

    @IsBoolean()
    is_unsorted: boolean

    @ValidateNested()
    @Type(() => LinksDto)
    _links: LinksDto
}

export class EmbeddedDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ContactDto)
    contacts: ContactDto[]
}

export class CreateContactResponseExternalDto {
    @ValidateNested()
    @Type(() => LinksDto)
    _links: LinksDto

    @ValidateNested()
    @Type(() => EmbeddedDto)
    _embedded: EmbeddedDto
}
