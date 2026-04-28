<script lang="ts" setup>
import { CheckCircle2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.params.orderId
</script>

<template>
  <section class="success">
    <div class="success__card">
      <CheckCircle2 class="success__icon" />

      <h1 class="success__title">Order {{ orderId }} has been placed successfully</h1>
      <RouterLink to="/">
        <button class="success__button">Back to Home</button>
      </RouterLink>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.success {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    max-width: 460px;
    padding: 48px 40px;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    text-align: center;
  }

  &__icon {
    width: 64px;
    height: 64px;
    padding: 16px;
    color: var(--c-accent);
    background: var(--c-accent-light);
    border-radius: 50%;
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--c-text);
    line-height: 1.35;
  }

  &__button {
    height: 48px;
    padding: 0 32px;
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
</style>
