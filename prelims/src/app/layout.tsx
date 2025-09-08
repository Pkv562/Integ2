import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pet Management System',
  description: 'A modern pet and user management system with dark theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
