import { IsString, IsNumber, IsOptional, MaxLength, Max } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(500)
  address: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
