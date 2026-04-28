<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useCartStore, type CartItem as CartItemType } from '../../model/cart.store'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    item: CartItemType
    variant?: 'drawer' | 'page'
  }>(),
  {
    variant: 'drawer',
  },
)

const cartStore = useCartStore()

const itemSubtotal = computed(() => props.item.price * props.item.quantity)
</script>

<template>
  <article class="cart-item" :class="`cart-item--${variant}`">
    <div class="cart-item__image-wrapper">
      <img :src="item.image" :alt="item.name" class="cart-item__image" />
    </div>

    <div class="cart-item__content">
      <div class="cart-item__top">
        <h3 class="cart-item__title">
          {{ item.name }}
        </h3>

        <button
          type="button"
          class="cart-item__remove-button"
          @click="cartStore.removeFromCart(item.id)"
        >
          <Trash2 :size="20" stroke-width="2" class="cart-item__remove-icon" />
        </button>
      </div>

      <p class="cart-item__price">{{ item.price.toFixed(2) }}</p>

      <div class="cart-item__footer">
        <div class="cart-item__quantity-controls">
          <button
            type="button"
            class="cart-item__quantity-button"
            @click="cartStore.decreaseQuantity(item.id)"
          >
            -
          </button>

          <span class="cart-item__quantity-value">
            {{ item.quantity }}
          </span>

          <button
            type="button"
            class="cart-item__quantity-button"
            @click="cartStore.incrementQuantity(item.id)"
          >
            +
          </button>
        </div>

        <p v-if="variant === 'page'" class="cart-item__subtotal">{{ itemSubtotal.toFixed(2) }}</p>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use './CartItem.scss';
</style>
