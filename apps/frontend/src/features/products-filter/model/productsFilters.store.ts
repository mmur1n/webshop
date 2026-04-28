import { defineStore } from 'pinia'
import { defaultProductFilters, type ProductFilters } from './filter.types'

interface ProductsFilterState {
  filters: ProductFilters
}

export const useProductsFiltersStore = defineStore('productsFilters', {
  state: (): ProductsFilterState => ({
    filters: {
      ...defaultProductFilters,
    },
  }),

  actions: {
    resetFilters() {
      this.filters.category = ''
      this.filters.minPrice = null
      this.filters.maxPrice = null
      this.filters.onlyInStock = false
      this.filters.page = 1
    },

    resetAll() {
      this.filters = { ...defaultProductFilters }
    },

    toQueryParams() {
      const q: Record<string, string | number> = {}

      if (this.filters.search !== defaultProductFilters.search) {
        q.search = this.filters.search
      }

      if (this.filters.category !== defaultProductFilters.category) {
        q.category = this.filters.category
      }

      if (
        this.filters.minPrice !== defaultProductFilters.minPrice &&
        this.filters.minPrice !== null
      ) {
        q.minPrice = this.filters.minPrice
      }

      if (
        this.filters.maxPrice !== defaultProductFilters.maxPrice &&
        this.filters.maxPrice !== null
      ) {
        q.maxPrice = this.filters.maxPrice
      }

      if (this.filters.sortBy !== defaultProductFilters.sortBy) {
        q.sortBy = this.filters.sortBy
      }

      if (this.filters.onlyInStock !== defaultProductFilters.onlyInStock) {
        q.onlyInStock = String(this.filters.onlyInStock)
      }

      if (this.filters.page !== defaultProductFilters.page) {
        q.page = this.filters.page
      }

      if (this.filters.limit !== defaultProductFilters.limit) {
        q.limit = this.filters.limit
      }

      return q
    },
  },
})
