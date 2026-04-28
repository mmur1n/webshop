<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalItems: number
  subtotal: number
  shipping: number | null
}>()

const total = computed(() => {
  if (!props.shipping) {
    return props.subtotal
  } else {
    return props.subtotal + props.shipping
  }
})
</script>

<template>
  <div class="order-summary-card">
    <h2 class="order-summary-card__title">Order summary</h2>

    <div class="order-summary-card__row">
      <span>Items</span>
      <span>{{ totalItems }}</span>
    </div>

    <div class="order-summary-card__row">
      <span>Subtotal</span>
      <span>{{ subtotal.toFixed(2) }}</span>
    </div>

    <div class="order-summary-card__row">
      <span>Shipping</span>
      <span v-if="shipping === null"> Calculated at checkout </span>

      <span v-else-if="shipping === 0"> Free </span>

      <span v-else>{{ shipping.toFixed(2) }} </span>
    </div>

    <div class="order-summary-card__total">
      <span>Total</span>
      <span>{{ total.toFixed(2) }}</span>
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use './OrderSummaryCard.scss';
</style>
