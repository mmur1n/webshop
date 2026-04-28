<script lang="ts" setup>
import { useCartStore } from '@/entities/cart/model/cart.store'
import CartItem from '@/entities/cart/ui/CartItem/CartItem.vue'
import OrderSummaryCard from '@/entities/order/ui/OrderSummaryCard.vue'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { items, totalItems, totalPrice } = storeToRefs(cartStore)
</script>
<template>
  <section class="cart-page">
    <div class="cart-page__container">
      <div class="cart-page__header">
        <h1 class="cart-page__title">Shopping cart</h1>
        <p class="cart-page__subtitle">
          {{ totalItems }} item<span v-if="totalItems !== 1">s</span> in your cart
        </p>
      </div>

      <div v-if="items.length === 0" class="cart-page__empty">
        <h2 class="cart-page__empty-title">Your cart is empty</h2>
        <p class="cart-page__empty-text">Looks like you haven’t added anything yet.</p>
        <RouterLink to="/" class="cart-page__continue-link"> Continue shopping </RouterLink>
      </div>

      <div v-else class="cart-page__content">
        <CartItem v-for="item in items" :key="item.id" :item="item" variant="page" />
      </div>

      <aside class="cart-page__summary">
        <OrderSummaryCard :total-items="totalItems" :subtotal="totalPrice" :shipping="0">
          <RouterLink to="/checkout" class="cart-page__checkout-button">
            Proceed to checkout
          </RouterLink>

          <button type="button" class="cart-page__clear-button" @click="cartStore.clearCart">
            Clear cart
          </button>
        </OrderSummaryCard>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cart-page {
  padding: 40px 0 60px;
}

.cart-page__container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px 48px;
  align-items: start;
}

.cart-page__header {
  grid-column: 1 / -1;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--c-border);
}

.cart-page__title {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
}

.cart-page__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--c-text-muted);
}

.cart-page__empty {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 48px 0;
}

.cart-page__empty-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--c-text);
}

.cart-page__empty-text {
  margin: 0;
  font-size: 15px;
  color: var(--c-text-muted);
}

.cart-page__content {
  grid-column: 1;
}

.cart-page__summary {
  grid-column: 2;
  position: sticky;
  top: 88px;
}

.cart-page__checkout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  margin-top: 4px;
  background-color: var(--c-accent);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.18s ease;

  &:hover {
    background-color: var(--c-accent-hover);
  }
}

.cart-page__clear-button {
  width: 100%;
  height: 42px;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #d95a5a;
  border: 1px solid #f0c8c8;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: #fdf0f0;
    border-color: #e8a0a0;
  }
}

.cart-page__continue-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-sec);
  text-decoration: none;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--c-text);
    border-color: var(--c-border-focus);
    background-color: var(--c-surface-2);
  }
}

@media (max-width: 768px) {
  .cart-page__container {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }

  .cart-page__header {
    grid-column: 1;
  }

  .cart-page__summary {
    grid-column: 1;
    position: static;
  }
}
</style>
