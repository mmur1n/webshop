import { ProductSortOrder } from '@webshop/shared'

export type UIProductSort =
  | 'default'
  | ProductSortOrder

export interface ProductFilters {
  search: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  sortBy: UIProductSort
  onlyInStock: boolean
  page: number
  limit: number
}

export const defaultProductFilters: ProductFilters = {
  search: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  sortBy: 'default',
  onlyInStock: true,
  page: 1,
  limit: 10,
}
