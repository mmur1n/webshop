import CartPage from '@/pages/CartPage.vue'
import ProductDetailsPage from '@/pages/ProductDetailsPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CheckoutPage from '@/pages/CheckoutPage.vue'
import OrderSuccesPage from '@/pages/OrderSuccesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'products',
      component: ProductsPage,
    },
    {
      path: '/products/:id',
      name: 'ProductDetails',
      component: ProductDetailsPage,
    },
    {
      path: '/cart',
      name: 'ShoppingCart',
      component: CartPage,
    },
    { path: '/checkout', name: 'Checkout', component: CheckoutPage },
    {
      path: '/checkout/success/:orderId',
      name: 'SuccessfulOrder',
      component: OrderSuccesPage,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundPage,
    },
  ],
})

export default router
