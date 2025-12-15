import { NextRequest, NextResponse } from 'next/server'
import { checkoutSchema, type CheckoutInput } from '@/lib/schemas/checkout-schema'
import { z } from 'zod'

// Type definitions
type CheckoutItem = CheckoutInput['items'][number]
type Customer = CheckoutInput['customer']

type Order = {
  id: string
  items: CheckoutItem[]
  total: number
  customer: Customer
  createdAt: string
}

type CheckoutSuccessResponse = {
  success: true
  orderId: string
  message: string
  order: Order
}

type CheckoutValidationErrorResponse = {
  success: false
  error: 'Validation error'
  details: string
}

type CheckoutErrorResponse = {
  success: false
  error: 'Internal server error'
  message: string
}

type CheckoutResponse = CheckoutSuccessResponse | CheckoutValidationErrorResponse | CheckoutErrorResponse

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    const body = await request.json()

    // Validate the request body with Zod
    const validatedData = checkoutSchema.parse(body)

    // Mock checkout processing
    // In a real application, this would:
    // 1. Process payment
    // 2. Create order in database
    // 3. Send confirmation email
    // 4. Update inventory
    // etc.

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock successful checkout response
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const order: Order = {
      id: orderId,
      items: validatedData.items,
      total: validatedData.total,
      customer: validatedData.customer,
      createdAt: new Date().toISOString(),
    }

    console.log('Order created:', order)

    const successResponse: CheckoutSuccessResponse = {
      success: true,
      orderId,
      message: `Thank you for your order! Your order has been confirmed and will be processed shortly.`,
      order,
    }

    return NextResponse.json(successResponse, { status: 200 })
  } catch (error) {
    console.error('Error in checkout route:', error)
    if (error instanceof z.ZodError) {
      const validationErrorResponse: CheckoutValidationErrorResponse = {
        success: false,
        error: 'Validation error',
        details: error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', '),
      }
      return NextResponse.json(validationErrorResponse, { status: 400 })
    }

    const errorResponse: CheckoutErrorResponse = {
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    console.error('Error in checkout route:', errorResponse)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
