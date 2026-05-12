import { IsOptional, IsString, IsUrl } from 'class-validator';

export class LinksDto {
  @IsUrl()
  main!: string;

  @IsOptional()
  @IsUrl()
  steam?: string;

  @IsOptional()
  @IsUrl()
  gog?: string;
}