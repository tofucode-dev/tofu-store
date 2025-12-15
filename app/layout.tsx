import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

const loraSerif = Lora({
  variable: '--font-serif',
  subsets: ['latin'],
})

const firaCodeMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Tofu Store',
  description: 'Tofu Store - Your source for all things',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className='h-full overflow-hidden'>
      <body
        className={`${plusJakartaSans.variable} ${loraSerif.variable} ${firaCodeMono.variable} antialiased h-full overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

export default RootLayout
