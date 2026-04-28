import { http } from './http'
import type {
  IProduct,
  IGetProductsParams,
  PaginatedResponse,
} from '@webshop/shared'

export const productsApi = {
  async getAll(params: IGetProductsParams) {
    const { data } = await http.get<PaginatedResponse<IProduct>>('/products', {
      params,
    })

    return data
  },

  async getById(id: number) {
    const { data } = await http.get<IProduct>(`/products/${id}`)
    return data
  },

  async getCategories() {
    return await http.get<string[]>('/products/categories')
  },
}
