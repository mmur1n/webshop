import type { IGetProductsParams, IProduct } from '@webshop/shared'
import { productsApi } from '@/shared/api/products.api'
import { defineStore } from 'pinia'

interface ProductsState {
  products: IProduct[]
  categories: string[]
  loadingProducts: boolean
  loadingCategories: boolean
  loadingProductById: boolean
  errorProducts: string | null
  errorCategories: string | null
  errorProductById: string | null
  total: number
  page: number
  limit: number
  totalPages: number
  currentProduct: IProduct | null
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    loadingProducts: false,
    loadingCategories: false,
    loadingProductById: false,
    errorProducts: null,
    errorCategories: null,
    errorProductById: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    currentProduct: null,
  }),

  actions: {
    async fetchProducts(params: IGetProductsParams) {
      this.loadingProducts = true
      this.errorProducts = null

      try {
        const res = await productsApi.getAll(params)
        this.products = res.data
        this.total = res.total
        this.page = res.page
        this.limit = res.limit
        this.totalPages = res.totalPages
      } catch (err) {
        this.errorProducts = err instanceof Error ? err.message : 'Failed to fetch products'
      } finally {
        this.loadingProducts = false
      }
    },

    async fetchCategories() {
      this.loadingCategories = true
      this.errorCategories = null

      try {
        const res = await productsApi.getCategories()
        this.categories = res.data
      } catch (err) {
        this.errorCategories = err instanceof Error ? err.message : 'Failed to load categories'
      } finally {
        this.loadingCategories = false
      }
    },

    async fetchProductById(id: number) {

      this.loadingProductById = true  
      this.errorProductById = null

      try {
        const res = await productsApi.getById(id)
        this.currentProduct = res
      } catch (err) {
        this.errorProductById = err instanceof Error ? err.message : 'Failed to load product'
      } finally {
        this.loadingProductById = false
      }
    },

    cleanCurrentProduct() {
      this.currentProduct = null
      this.errorProductById = null
    },
  },
})
