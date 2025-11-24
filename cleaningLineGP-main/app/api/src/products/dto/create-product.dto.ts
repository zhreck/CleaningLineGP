import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  Min,
  IsInt,
  IsBoolean,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly slug: string;

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

  @IsBoolean()
  @IsOptional()
  readonly isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly isOnSale?: boolean;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly discountPercent?: number;
}
