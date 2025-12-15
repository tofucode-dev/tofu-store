import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/lib/types/product'

export type CartItem = {
  product: Product
  quantity: number
}

export type CartStoreState = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.objectID === product.objectID)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.objectID === product.objectID
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }
          return {
            items: [...state.items, { product, quantity }],
          }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.objectID !== productId),
        }))
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.objectID === productId ? { ...item, quantity } : item,
          ),
        }))
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'tofu-store-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

