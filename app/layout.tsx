import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from "@/lib/supabase-auth"
import { PerformanceMonitor } from "@/components/performance-monitor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student E-Governance System",
  description: "A digital platform for student communication, engagement, and governance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PerformanceMonitor>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </PerformanceMonitor>
      </body>
    </html>
  )
}

