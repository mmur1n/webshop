<script setup lang="ts">
import ProductCard from '@/entities/product/ui/ProductCard/ProductCard.vue'
import FiltersPanel from '@/features/products-filter/ui/FiltersPanel.vue'
import { useProductsFiltersStore } from '@/features/products-filter/model/productsFilters.store'
import { useProductsStore } from '@/stores/products.store'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import ProductCardSkeleton from '@/entities/product/ui/ProductCardSkeleton/ProductCardSkeleton.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const filtersStore = useProductsFiltersStore()

const { products, loadingProducts, errorProducts, totalPages, total } = storeToRefs(productsStore)
const { filters } = storeToRefs(filtersStore)

const requestParams = computed(() => ({
  search: filters.value.search || undefined,
  category: filters.value.category || undefined,
  minPrice: filters.value.minPrice ?? undefined,
  maxPrice: filters.value.maxPrice ?? undefined,
  sort: filters.value.sortBy === 'default' ? undefined : filters.value.sortBy,
  page: filters.value.page,
  limit: filters.value.limit,
}))

const loadProducts = async () => {
  await productsStore.fetchProducts(requestParams.value)
}

const loadCategories = async () => {
  await productsStore.fetchCategories()
}

const goToNextPage = () => {
  if (filters.value.page < totalPages.value) {
    filters.value.page += 1
  }
}

const goToPrevPage = () => {
  if (filters.value.page > 1) {
    filters.value.page -= 1
  }
}

const paginationItems = computed<(number | string)[]>(() => {
  const currentPage = filters.value.page
  const lastPage = totalPages.value

  if (lastPage < 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', lastPage]
  }

  if (currentPage >= lastPage - 2) {
    return [1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage]
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== filters.value.page) {
    filters.value.page = page
  }
}

const goToFirstPage = () => {
  if (filters.value.page !== 1) {
    filters.value.page = 1
  }
}

const goToLastPage = () => {
  if (filters.value.page !== totalPages.value) {
    filters.value.page = totalPages.value
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null

function getStringQuery(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function getNumberQuery(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

watch(
  () => filters.value.search,
  () => {
    filters.value.page = 1

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      loadProducts()
    }, 400)
  },
)

watch(
  () => [
    filters.value.category,
    filters.value.maxPrice,
    filters.value.minPrice,
    filters.value.onlyInStock,
    filters.value.sortBy,
    filters.value.limit,
  ],
  () => {
    filters.value.page = 1
    loadProducts()
  },
)

watch(
  () => filters.value.page,
  () => {
    loadProducts()
  },
)

onMounted(() => {
  loadProducts()
  loadCategories()
})

onBeforeUnmount(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <main>
    <section class="products-page">
      <h1 class="products-page__title">Products</h1>

      <div class="products-page__layout">
        <FiltersPanel />

        <div class="products-page__content">
          <div class="products-page__toolbar">
            <div class="products-page__toolbar-group products-page__toolbar-group--search">
              <input
                id="products-search"
                v-model="filters.search"
                class="products-page__search-input"
                type="text"
                placeholder="Search products..."
              />
            </div>

            <div class="products-page__toolbar-group">
              <select
                id="products-sort"
                v-model="filters.sortBy"
                class="products-page__toolbar-select"
              >
                <option value="default">Default</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating_desc">Rating: high to low</option>
                <option value="rating_asc">Rating: low to high</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
              </select>
            </div>

            <div class="products-page__toolbar-group">
              <select
                id="products-limit"
                v-model.number="filters.limit"
                class="products-page__toolbar-select"
              >
                <option :value="10">Show 10</option>
                <option :value="20">Show 20</option>
                <option :value="50">Show 50</option>
                <option :value="100">Show 100</option>
              </select>
            </div>
          </div>
          <div v-if="loadingProducts" class="products-page__grid">
            <ProductCardSkeleton v-for="n in filters.limit" :key="n" />
          </div>

          <div v-if="products.length === 0" class="products-page__state">No products found</div>

          <p v-else-if="errorProducts">{{ errorProducts }}</p>

          <div v-else class="products-page__grid">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
          </div>

          <div v-if="totalPages > 1" class="products-page__pagination">
            <button
              v-if="filters.page != 1"
              class="products-page__pagination-button"
              type="button"
              @click="goToFirstPage"
            >
              «
            </button>

            <button
              class="products-page__pagination-button"
              type="button"
              :disabled="filters.page === 1"
              @click="goToPrevPage"
            >
              ‹
            </button>

            <div class="products-page__pagination-pages">
              <template v-for="(item, index) in paginationItems" :key="`${item}-${index}`">
                <button
                  class="products-page__pagination-page"
                  :class="{
                    'products-page__pagination-page--active': item === filters.page,
                    'products-page__pagination-page--dots': item === '...',
                  }"
                  type="button"
                  :disabled="item === '...'"
                  @click="typeof item === 'number' && goToPage(item)"
                >
                  {{ item }}
                </button>
              </template>
            </div>

            <button
              class="products-page__pagination-button"
              type="button"
              :disabled="filters.page === totalPages"
              @click="goToNextPage"
            >
              ›
            </button>

            <button
              v-if="filters.page != totalPages"
              class="products-page__pagination-button"
              type="button"
              @click="goToLastPage"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.products-page {
  padding: 32px;

  &__title {
    margin: 0 0 28px;
    font-size: 28px;
    font-weight: 700;
    color: var(--c-text);
    letter-spacing: -0.02em;
  }

  &__layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: start;
  }

  &__content {
    min-width: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
  }

  &__toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px 120px;
    gap: 16px;
    margin-bottom: 24px;
    align-items: end;
  }

  &__toolbar-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &--search {
      min-width: 0;
    }
  }

  &__search-input,
  &__toolbar-select {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 1px solid var(--c-border);
    border-radius: var(--radius-md);
    background: var(--c-surface);
    font-family: inherit;
    font-size: 14px;
    color: var(--c-text);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--c-border-focus);
      box-shadow: 0 0 0 3px rgba(126, 203, 160, 0.18);
    }
  }

  &__state {
    padding: 48px 0;
    text-align: center;
    font-size: 15px;
    color: var(--c-text-muted);
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 36px;
    flex-wrap: wrap;
  }

  &__pagination-pages {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__pagination-button,
  &__pagination-page {
    min-width: 40px;
    height: 40px;
    padding: 0 14px;
    border: 1px solid var(--c-border);
    border-radius: var(--radius-sm);
    background: var(--c-surface);
    color: var(--c-text);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.18s ease,
      border-color 0.18s ease,
      color 0.18s ease,
      opacity 0.18s ease;

    &:hover:not(:disabled) {
      background: var(--c-accent-light);
      border-color: var(--c-border-focus);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__pagination-page {
    padding: 0;
  }

  &__pagination-page--active {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: #ffffff;

    &:hover {
      background: var(--c-accent-hover);
      border-color: var(--c-accent-hover);
    }
  }

  &__pagination-page--dots {
    border-color: transparent;
    background: transparent;
    color: var(--c-text-muted);
    cursor: default;

    &:hover {
      background: transparent;
      border-color: transparent;
    }
  }
}

@media (max-width: 768px) {
  .products-page {
    padding: 20px 16px;

    &__title {
      font-size: 22px;
      margin-bottom: 20px;
    }

    &__layout {
      grid-template-columns: 1fr;
    }

    &__toolbar {
      grid-template-columns: 1fr 1fr;
    }

    &__toolbar-group--search {
      grid-column: 1 / -1;
    }

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }
  }
}
</style>
