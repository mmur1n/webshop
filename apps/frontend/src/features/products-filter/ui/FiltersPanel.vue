<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useProductsFiltersStore } from '../model/productsFilters.store'
import { useProductsStore } from '@/stores/products.store'

const filtersStore = useProductsFiltersStore()
const productsStore = useProductsStore()

const { filters } = storeToRefs(filtersStore)
const { categories, loadingCategories } = storeToRefs(productsStore)

const resetFilters = () => {
  filtersStore.resetFilters()
}
</script>

<template>
  <aside class="filters-panel">
    <div class="filters-panel__header">
      <h2 class="filters-panel__title">Filters</h2>
      <button class="filters-panel__reset" type="button" @click="resetFilters">Reset</button>
    </div>

    <div class="filters-panel__group">
      <label class="filters-panel__label" for="category">Category</label>
      <select id="category" v-model="filters.category" class="filters-panel__input">
        <option value="">{{ loadingCategories ? 'Loading categories' : 'All categories' }}</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div class="filters-panel__group">
      <label class="filters-panel__label">Price range</label>

      <div class="filters-panel__row">
        <input
          v-model.number="filters.minPrice"
          class="filters-panel__input"
          type="number"
          min="0"
          placeholder="Min"
        />

        <input
          v-model.number="filters.maxPrice"
          class="filters-panel__input"
          type="number"
          min="0"
          placeholder="Max"
        />
      </div>
    </div>

    <div class="filters-panel__group filters-panel__group--checkbox">
      <label class="filters-panel__checkbox">
        <input v-model="filters.onlyInStock" type="checkbox" />
        <span>Only in stock</span>
      </label>
    </div>
  </aside>
</template>

<style lang="scss">
@use './FiltersPanel.scss';
</style>
