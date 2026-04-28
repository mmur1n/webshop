import { Injectable, NotFoundException } from '@nestjs/common';
import { getProductsDto } from './dto/get-products.dto';
import { IProduct, ProductSortOrder } from '@webshop/shared';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(q: getProductsDto) {
    const page = q.page;
    const limit = q.limit;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (q.search) {
      where.name = {
        contains: q.search,
        mode: 'insensitive',
      };
    }

    if (q.category) {
      where.category = q.category;
    }

    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      where.price = {
        gte: q.minPrice,
        lte: q.maxPrice,
      };
    }

    if (q.onlyInStock) {
      where.stock = { gt: 0 };
    }

    const orderBy = this.buildOrderBy(q.sort);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: q.limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private buildOrderBy(
    sort?: ProductSortOrder,
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case ProductSortOrder.PRICE_ASC:
        return [{ price: 'asc' }];
      case ProductSortOrder.PRICE_DESC:
        return [{ price: 'desc' }];
      case ProductSortOrder.RATING_ASC:
        return [{ rating: 'asc' }];
      case ProductSortOrder.RATING_DESC:
        return [{ rating: 'desc' }];
      case ProductSortOrder.NAME_ASC:
        return [{ name: 'asc' }];
      case ProductSortOrder.NAME_DESC:
        return [{ name: 'desc' }];
      default:
        return [{ id: 'asc' }];
    }
  }

  async getProductById(id: number): Promise<IProduct> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    return categories.map((item) => item.category);
  }
}
