import { IsString, IsNumber, IsOptional, IsArray, IsDateString, Min, Max, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsNumber()
  durationMin?: number;

  @IsNumber()
  venueId: number;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsNumber()
  durationMin?: number;

  @IsOptional()
  @IsNumber()
  venueId?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateEventStatusDto {
  @IsString()
  status: string;
}
