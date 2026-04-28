<script setup lang="ts">
import CartDrawer from './entities/cart/ui/CartDrawer/CartDrawer.vue'
import AppHeader from './widgets/header/ui/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
  <CartDrawer />
</template>

<style scoped></style>
