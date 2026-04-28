import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  PRODUCT_PAGINATION_DEFAULTS,
  IGetProductsParams,
  ProductSortOrder,
} from '@webshop/shared';

export class getProductsDto implements IGetProductsParams {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(ProductSortOrder)
  sort?: ProductSortOrder;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = PRODUCT_PAGINATION_DEFAULTS.PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = PRODUCT_PAGINATION_DEFAULTS.LIMIT;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true' || value === true) return true;
    return false;
  })
  onlyInStock?: boolean;
}
