import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/helpers/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          {children}
          <Navigation />
        </div>
      </body>
    </html>
  )
}
