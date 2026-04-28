<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
<template>
  <section class="not-found">
    <div class="not-found__content">
      <h1 class="not-found__title">404</h1>
      <p class="not-found__subtitle">Page not found</p>

      <button class="not-found__button" @click="goHome">Go back to shop</button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}

.not-found__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.not-found__title {
  margin: 0;
  font-size: 148px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.15em;
  color: var(--c-accent);
}

.not-found__subtitle {
  margin: -4px 0 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--c-text-muted);
}

.not-found__button {
  margin-top: 12px;
  height: 48px;
  padding: 0 36px;
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
</style>
