import { beforeEach } from 'vitest'
import { useCartStore } from '@/lib/stores/cart-store'

// Reset cart store before each test
beforeEach(() => {
  useCartStore.setState({ items: [] })
})

