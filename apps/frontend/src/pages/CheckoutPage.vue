<script setup lang="ts">
import { useCartStore } from '@/entities/cart/model/cart.store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import OrderSummaryCard from '@/entities/order/ui/OrderSummaryCard.vue'
import { ordersApi } from '@/shared/api/orders.api'
import type { ICheckoutOrderPayload } from '@webshop/shared'

const router = useRouter()
const cartStore = useCartStore()
const { items, totalItems, totalPrice } = storeToRefs(cartStore)

const shippingPrice = 0

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
})

const errorMessage = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

const orderTotal = computed(() => totalPrice.value + shippingPrice)

function validateForm(): boolean {
  if (
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.phone ||
    !form.address ||
    !form.city ||
    !form.postalCode
  ) {
    errorMessage.value = 'Please fill in all required fields.'
    return false
  }

  const emailIsValid = /\S+@\S+\.\S+/.test(form.email)

  if (!emailIsValid) {
    errorMessage.value = 'Please enter a valid email address.'
    return false
  }

  errorMessage.value = ''
  return true
}

async function handleSubmit(): Promise<void> {
  if (!validateForm()) {
    return
  }

  if (items.value.length === 0) {
    submitError.value = 'Your cart is empty.'
    return
  }

  const payload: ICheckoutOrderPayload = {
    customer: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
    },

    shippingAddress: {
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
    },

    items: items.value.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),

    summary: {
      totalItems: totalItems.value,
      subtotal: totalPrice.value,
      shipping: shippingPrice,
      total: orderTotal.value,
    },
  }

  try {
    isSubmitting.value = true

    const res = await ordersApi.submitOrder(payload)
    cartStore.clearCart()

    router.push({
      name: 'SuccessfulOrder',
      params: {
        orderId: res.orderId,
      },
    })
  } catch (e) {
    console.error(e)
    submitError.value = 'Failed to place order. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-page__container">
      <div class="checkout-page__header">
        <h1 class="checkout-page__title">Checkout</h1>
        <p class="checkout-page__subtitle">Complete your order details below</p>
      </div>

      <div v-if="items.length === 0" class="checkpout-page__empty">
        <h2 class="checkout-page__empty-title">Your cart is empty</h2>
        <p class="checkout-page__empty-text">Add some products before proceeding to checkout.</p>

        <RouterLink to="/" class="checkout-page__back-link"> Go to products </RouterLink>
      </div>

      <div v-else class="checkout-page__content">
        <form class="checkout-page__form" @submit.prevent="handleSubmit">
          <div class="checkout-page__form-section">
            <h2 class="checkout-page__section-title">Your Information</h2>

            <div class="checkout-page__grid checkout-page__grid--two">
              <div class="checkout-page__field">
                <label class="checkout-page__label" for="firstName">First Name</label>
                <input
                  id="firstName"
                  v-model.trim="form.firstName"
                  type="text"
                  class="checkout-page__input"
                  placeholder="John"
                />
              </div>

              <div class="checkout-page__field">
                <label class="checkout-page__label" for="lastName">Last Name</label>
                <input
                  id="lastName"
                  v-model.trim="form.lastName"
                  type="text"
                  class="checkout-page__input"
                  placeholder="Smith"
                />
              </div>
            </div>
            <div class="checkout-page__grid checkout-page__grid--two">
              <div class="checkout-page__field">
                <label class="checkout-page__label" for="email">E-Mail</label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  class="checkout-page__input"
                  placeholder="john@example.com"
                />
              </div>
              <div class="checkout-page__field">
                <label class="checkout-page__label" for="phone">Phone</label>
                <input
                  id="phone"
                  v-model.trim="form.phone"
                  type="tel"
                  class="checkout-page__input"
                  placeholder="+49 123 4567890"
                />
              </div>
            </div>
          </div>

          <div class="checkout-page__form-section">
            <h2 class="checkout-page__section-title">Shipping Address</h2>

            <div class="checkout-page__field">
              <label class="checkout-page__label" for="address">Address</label>
              <input
                id="address"
                v-model.trim="form.address"
                type="text"
                class="checkout-page__input"
                placeholder="Street and house number"
              />
            </div>

            <div class="checkout-page__grid checkout-page__grid--two">
              <div class="checkout-page__field">
                <label class="checkout-page__label" for="city">City</label>
                <input
                  id="city"
                  v-model.trim="form.city"
                  type="text"
                  class="checkout-page__input"
                  placeholder="Karlsruhe"
                />
              </div>

              <div class="checkout-page__field">
                <label class="checkout-page__label" for="address">Postal code</label>
                <input
                  id="postalCode"
                  v-model.trim="form.postalCode"
                  type="text"
                  class="checkout-page__input"
                  placeholder="76131"
                />
              </div>
            </div>
          </div>

          <p v-if="errorMessage" class="checkout-page__error">
            {{ errorMessage }}
          </p>
        </form>

        <aside class="checkout-page__summary">
          <OrderSummaryCard
            :total-items="totalItems"
            :subtotal="totalPrice"
            :shipping="shippingPrice"
          >
            <button
              type="button"
              class="checkout-page__submit-button"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              {{ isSubmitting ? 'Placing order...' : 'Place order' }}
            </button>
            <p class="checkout-page__privacy-note">No data will be saved</p>
          </OrderSummaryCard>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout-page {
  padding: 40px 0 60px;
}

.checkout-page__container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
}

.checkout-page__header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--c-border);
}

.checkout-page__title {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
}

.checkout-page__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--c-text-muted);
}

// Empty state (опечатка в шаблоне: checkpout)
.checkpout-page__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 48px 0;
}

.checkout-page__empty-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--c-text);
}

.checkout-page__empty-text {
  margin: 0;
  font-size: 15px;
  color: var(--c-text-muted);
}

.checkout-page__back-link {
  display: inline-flex;
  align-items: center;
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

.checkout-page__content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px 48px;
  align-items: start;
}

.checkout-page__summary {
  position: sticky;
  top: 88px;
}

.checkout-page__form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkout-page__form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.checkout-page__section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--c-text);
}

.checkout-page__grid {
  display: grid;
  gap: 16px;

  &--two {
    grid-template-columns: 1fr 1fr;
  }
}

// Опечатка в шаблоне: checkout
.checkout-page__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkout-page__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-sec);
}

.checkout-page__input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
  color: var(--c-text);
  background: var(--c-surface);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: var(--c-text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--c-border-focus);
    box-shadow: 0 0 0 3px rgba(126, 203, 160, 0.18);
  }
}

.checkout-page__error {
  margin: 0;
  font-size: 13px;
  color: #d95a5a;
  padding: 10px 14px;
  background: #fdf0f0;
  border: 1px solid #f0c8c8;
  border-radius: var(--radius-sm);
}

.checkout-page__privacy-note {
  margin: 0;
  font-size: 12px;
  color: var(--c-text-muted);
  text-align: center;
}

.checkout-page__submit-button {
  width: 100%;
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

@media (max-width: 768px) {
  .checkout-page {
    padding: 24px 0 40px;
  }

  .checkout-page__container {
    padding: 0 16px;
  }

  .checkout-page__content {
    grid-template-columns: 1fr;
  }

  .checkout-page__summary {
    position: static;
  }

  .checkout-page__grid--two {
    grid-template-columns: 1fr;
  }
}
</style>
