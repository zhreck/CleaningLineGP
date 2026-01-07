import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({
        description: 'Page number (1-based)',
        minimum: 1,
        default: 1,
        required: false,
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 20,
        required: false,
        example: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiProperty({
        description: 'Search term to filter products by name (case-insensitive)',
        required: false,
        example: 'laptop',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: 'Filter products by category ID',
        minimum: 1,
        required: false,
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    lastPage: number;
    hasMore: boolean;
}

export interface ProductFilters {
    search?: string;
    categoryId?: number;
}