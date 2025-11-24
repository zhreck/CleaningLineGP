import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  readonly price: number;

  @IsInt()
  @Min(0)
  readonly stock: number;

  @IsUrl()
  @IsOptional()
  readonly imageUrl?: string;

  @IsInt()
  @IsPositive()
  readonly categoryId: number;
}
