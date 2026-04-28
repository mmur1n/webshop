<script setup lang="ts">
import { useCartStore } from '@/entities/cart/model/cart.store'
import { storeToRefs } from 'pinia'
import { ShoppingCart } from 'lucide-vue-next'

const cartStore = useCartStore()

const { totalItems } = storeToRefs(cartStore)
</script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <RouterLink to="/" class="app-header__top"> WebShop</RouterLink>
    </div>

    <nav class="app-header__nav">
      <RouterLink to="/" class="app-header__nav-link"> Products</RouterLink>
    </nav>

    <button type="button" class="app-header__cart-button" @click="cartStore.toggleCart">
      <ShoppingCart :size="20" stroke-width="2" class="app-header__cart-icon" />
      <span v-if="totalItems > 0" class="app-header__cart-badge">{{ totalItems }}</span>
    </button>
  </header>
</template>

<style lang="scss" scoped>
@use './AppHeader.scss';
</style>
