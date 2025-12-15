'use server'

import { checkoutSchema, type CheckoutInput } from '@/lib/schemas/checkout-schema'
import { revalidatePath } from 'next/cache'

export type CheckoutResult =
  | { success: true; orderId: string; message: string }
  | { success: false; error: string; details?: string }

export async function checkoutAction(data: CheckoutInput): Promise<CheckoutResult> {
  try {
    // Validate the input data
    const validatedData = checkoutSchema.parse(data)

    // Call the API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Checkout failed',
        details: result.details,
      }
    }

    // Revalidate any relevant paths if needed
    revalidatePath('/')

    return {
      success: true,
      orderId: result.orderId,
      message: result.message || 'Order placed successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation error',
        details: error.message,
      }
    }

    return {
      success: false,
      error: 'Checkout failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

