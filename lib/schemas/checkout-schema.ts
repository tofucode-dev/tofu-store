import { z } from 'zod'

export const checkoutItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  brand: z.string().optional(),
})

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'Cart must contain at least one item'),
  customer: z.object({
    email: z.email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  total: z.number().positive('Total must be positive'),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

