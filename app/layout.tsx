import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Permanent_Marker } from "next/font/google";

const marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js Photobooth - Create Amazing Photos',
  description: 'A modern photobooth application built with Next.js 15 - Capture, customize, and share your moments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}