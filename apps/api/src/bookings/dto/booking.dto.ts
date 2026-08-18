import { IsNumber, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  spotsCount: number;
}
