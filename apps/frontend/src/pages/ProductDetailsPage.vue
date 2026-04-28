<script setup lang="ts">
import { useCartStore } from '@/entities/cart/model/cart.store'
import { useProductsStore } from '@/stores/products.store'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productStore = useProductsStore()
const cartStore = useCartStore()

const { currentProduct, errorProductById, loadingProductById } = storeToRefs(productStore)

const quantity = ref(1)

onMounted(() => {
  const productId = Number(route.params.id)
  productStore.fetchProductById(productId)
})

onUnmounted(() => productStore.cleanCurrentProduct())

function increaseQuantity(): void {
  quantity.value += 1
}

function decreaseQuantity(): void {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
}

function handleAddToCart() {
  if (!currentProduct.value) {
    return
  }

  cartStore.addToCart({
    id: currentProduct.value.id,
    name: currentProduct.value.name,
    price: currentProduct.value.price,
    image: currentProduct.value.image,
    quantity: quantity.value,
  })

  quantity.value = 1
}
</script>

<template>
  <section class="product-details-page">
    <div class="container">
      <RouterLink to="/" class="product-details-page__back-link"> ← Back to products </RouterLink>

      <div v-if="loadingProductById" class="product-details-page__state">Loading product...</div>

      <div
        v-else-if="errorProductById"
        class="product-details-page__state product-details-page__state--error"
      >
        {{ errorProductById }}
      </div>

      <div v-else-if="!currentProduct" class="product-details-page__state">Product not found.</div>

      <div v-else class="product-details">
        <div class="product-details__image-wrapper">
          <img
            :src="currentProduct.image"
            :alt="currentProduct.name"
            class="product-details__image"
          />
        </div>

        <div class="product-details__content">
          <p class="product-details__category">
            {{ currentProduct.category }}
          </p>

          <h1 class="product-details__title">
            {{ currentProduct.name }}
          </h1>

          <div class="product-details__rating">
            <span class="product-details__rating-star">★</span>
            <span class="product-details__rating-value">{{ currentProduct.rating }}</span>
          </div>

          <p class="product-details__price">${{ currentProduct.price }}</p>

          <div class="product-details__stock">
            <span v-if="currentProduct.stock > 0" class="stock-status stock-status--in-stock"
              >Ready for shipping</span
            >
            <span v-else class="stock-status stock-status--out-of-stock">Out of stock</span>
          </div>

          <hr class="product-details__divider" />

          <p class="product-details__description">
            {{ currentProduct.description }}
          </p>

          <div class="product-details__actions">
            <div class="quantity-selector">
              <button type="button" class="quantity-selector__button" @click="decreaseQuantity">
                -
              </button>
              <span class="quantity-selector__value">{{ quantity }}</span>
              <button type="button" class="quantity-selector__button" @click="increaseQuantity">
                +
              </button>
            </div>
            <button
              type="button"
              class="product-details__button"
              :disabled="currentProduct.stock === 0"
              @click="handleAddToCart"
            >
              {{ currentProduct.stock > 0 ? 'Add to cart' : 'Out of stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.product-details-page {
  padding: 40px 0 60px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
}

.product-details-page__back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 36px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-sec);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: var(--c-accent);
  }
}

.product-details-page__state {
  padding: 80px 0;
  text-align: center;
  font-size: 15px;
  color: var(--c-text-muted);

  &--error {
    color: #d95a5a;
  }
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  &__image-wrapper {
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    box-shadow: var(--shadow-md);
  }

  &__image {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__category {
    display: inline-block;
    align-self: flex-start;
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--c-text-muted);
    background: var(--c-surface-2);
    border: 1px solid var(--c-border);
    padding: 4px 12px;
    border-radius: 99px;
  }

  &__title {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.2;
    color: var(--c-text);
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__rating-star {
    font-size: 17px;
    color: var(--c-accent);
    line-height: 1;
  }

  &__rating-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--c-text-muted);
  }

  &__price {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--c-accent);
  }

  &__stock {
    display: flex;
  }

  &__divider {
    border: none;
    border-top: 1px solid var(--c-border);
    margin: 2px 0;
  }

  &__description {
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
    color: var(--c-text-sec);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  &__button {
    flex: 1;
    height: 50px;
    background-color: var(--c-accent);
    color: #fff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.18s ease;

    &:hover {
      background-color: var(--c-accent-hover);
    }
  }
}

.stock-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &--in-stock {
    color: var(--c-accent);

    &::before {
      background-color: var(--c-accent);
    }
  }

  &--out-of-stock {
    color: #d95a5a;

    &::before {
      background-color: #d95a5a;
    }
  }
}

.quantity-selector {
  display: inline-flex;
  align-items: center;
  height: 50px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: var(--c-surface);
  overflow: hidden;

  &__button {
    width: 46px;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 20px;
    font-weight: 300;
    color: var(--c-text-sec);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    &:hover {
      background-color: var(--c-accent-light);
      color: var(--c-accent);
    }
  }

  &__value {
    min-width: 38px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--c-text);
  }
}

@media (max-width: 768px) {
  .product-details-page {
    padding: 24px 0 40px;
  }

  .container {
    padding: 0 16px;
  }

  .product-details {
    grid-template-columns: 1fr;
    gap: 24px;

    &__title {
      font-size: 24px;
    }

    &__price {
      font-size: 22px;
    }
  }
}
</style>
