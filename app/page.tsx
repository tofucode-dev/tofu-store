import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TofuStore - Premium Products Online',
  description:
    'Browse our wide selection of premium products. Filter by category, brand, price, and more. Free shipping on orders over $50.',
  openGraph: {
    title: 'TofuStore - Premium Products Online',
    description:
      'Browse our wide selection of premium products. Filter by category, brand, price, and more. Free shipping on orders over $50.',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'TofuStore - Premium Products Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TofuStore - Premium Products Online',
    description:
      'Browse our wide selection of premium products. Filter by category, brand, price, and more. Free shipping on orders over $50.',
  },
}

const Home = () => {
  redirect('/products')
}

export default Home
