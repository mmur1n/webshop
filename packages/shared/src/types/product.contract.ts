import { ProductSortOrder } from "../enum/product.enum";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface IGetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSortOrder;
  onlyInStock?: boolean;
  page?: number;
  limit?: number;
}
