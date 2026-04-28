<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '../../model/cart.store'
import { computed, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import CartItem from '../CartItem/CartItem.vue'

const cartStore = useCartStore()
const { items, isCartOpen, totalItems, totalPrice } = storeToRefs(cartStore)

const formattedTotalPrice = computed(() => totalPrice.value.toFixed(2))

watch(isCartOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cart-overlay">
      <div v-if="isCartOpen" class="cart-drawer-overlay" @click="cartStore.closeCart" />
    </Transition>

    <Transition name="cart-drawer">
      <aside v-if="isCartOpen" class="cart-drawer">
        <div class="cart-drawer__header">
          <div>
            <h2 class="cart-drawer__title">Your cart</h2>
            <p class="cart-drawer__subtitle">
              {{ totalItems }} item<span v-if="totalItems !== 1">s</span>
            </p>
          </div>
          <button type="button" class="cart-drawer__close-button" @click="cartStore.closeCart">
            <X :size="20" stroke-width="2" class="cart-drawer__close-icon" />
          </button>
        </div>

        <div v-if="items.length === 0" class="cart-drawer__empty">
          <p class="cart-drawer__empty-text">Your cart is empty</p>
          <button type="button" class="cart-drawer__continue-button" @click="cartStore.closeCart">
            Continue shopping
          </button>
        </div>

        <template v-else>
          <div class="cart-drawer__body">
            <CartItem v-for="item in items" :key="item.id" :item="item" variant="drawer"/>
          </div>

          <div class="cart-drawer__footer">
            <div class="cart-drawer__summary">
              <span class="cart-drawer__summary-label">Subtotal</span>
              <span class="cart-drawer__summary-value">{{ formattedTotalPrice }}</span>
            </div>
            <p class="cart-drawer__note">Shipping is calculated at checkout.</p>
            <RouterLink to="/cart" class="cart-drawer__checkout-link" @click="cartStore.closeCart">
              Go to Cart
            </RouterLink>
            <button type="button" class="cart-drawer__continue-button" @click="cartStore.closeCart">
              Continue shopping
            </button>
          </div>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use './CartDrawer.scss';
</style>
