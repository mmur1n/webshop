<script setup lang="ts">
import type { IProduct } from '@webshop/shared';

defineProps<{
  product: IProduct
}>()
</script>

<template>
  <RouterLink :to="`/products/${product.id}`" class="product-card">
    <img class="product-card__image" :src="product.image" :alt="product.name" />

    <div class="product-card__content">
      <div class="product-card__meta">
        <span class="product-card__category">{{ product.category }}</span>
        <span class="product-card__rating">⭐ {{ product.rating }}</span>
      </div>

      <h3 class="product-card__title">{{ product.name }}</h3>
      <p class="product-card__description">{{ product.description }}</p>

      <div class="product-card__footer">
        <span class="product-card__price">{{ product.price.toFixed(2) }}</span>
        <span
          class="product-card__stock"
          :class="{ 'product-card__stock--out': product.stock === 0 }"
          >{{ product.stock > 0 ? 'Ready for shipping' : 'Out of stock' }}</span
        >
      </div>
      <button class="product-card__button" type="button">View Details</button>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use './ProductCard.style.scss';
</style>
