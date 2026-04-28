import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}


interface CartState {
  items: CartItem[]
  isCartOpen: boolean
}
const CART_STORAGE_KEY = 'cart-items'

function loadCartItems(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  const rawCart = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!rawCart) {
    return []
  }

  try {
    const parsedCart = JSON.parse(rawCart)

    if (!Array.isArray(parsedCart)) {
      return []
    }
    return parsedCart
  } catch (err) {
    console.error('Failes to load Cart from localStorage:', err)
    return []
  }
}

function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: loadCartItems(),
    isCartOpen: false,
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    addToCart(product: CartItem) {
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += product.quantity
        return
      } else {
        this.items.push({ ...product })
      }

      saveCartItems(this.items)
      this.isCartOpen = true
    },

    removeFromCart(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
      saveCartItems(this.items)
    },

    incrementQuantity(id: number) {
      const item = this.items.find((item) => item.id === id)

      if (!item) {
        return
      }

      item.quantity += 1
      saveCartItems(this.items)
    },

    decreaseQuantity(id: number) {
      const item = this.items.find((item) => item.id === id)

      if (!item) {
        return
      }

      if (item.quantity > 1) {
        item.quantity -= 1
        saveCartItems(this.items)
        return
      }

      this.removeFromCart(id)
    },

    clearCart() {
      this.items = []
      saveCartItems(this.items)
    },

    openCart() {
      this.isCartOpen = true
    },

    closeCart() {
      this.isCartOpen = false
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    },
  },
})
