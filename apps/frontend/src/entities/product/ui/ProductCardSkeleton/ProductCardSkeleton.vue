<script setup lang="ts"></script>

<template>
  <article class="product-card-skeleton">
    <div class="product-card-skeleton__image shimmer"></div>

    <div class="product-card-skeleton__content">
      <div class="product-card-skeleton__meta">
        <div class="product-card-skeleton__category shimmer"></div>
        <div class="product-card-skeleton__rating shimmer"></div>
      </div>

      <div class="product-card-skeleton__title shimmer"></div>
      <div class="product-card-skeleton__description shimmer"></div>

      <div class="product-card-skeleton__footer">
        <div class="product-card-skeleton__price shimmer"></div>
        <div class="product-card-skeleton__stock shimmer"></div>
      </div>
      <div class="product-card-skeleton__button shimmer"></div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use './ProductCardSkeleton.style.scss';
</style>
