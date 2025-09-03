"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  Bell,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  User,
  Vote,
  BarChart2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/supabase-auth'
import { LoadingTimeout } from '@/components/loading-timeout'
import { NotificationProvider } from '@/lib/notifications-context'
import { NotificationDropdown } from '@/components/notification-dropdown'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, profile } = useAuth()
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  if (isLoading) {
    return (
      <LoadingTimeout timeout={10000}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Loading your dashboard...</p>
              <p className="text-sm text-muted-foreground">This should only take a moment</p>
            </div>
          </div>
        </div>
      </LoadingTimeout>
    )
  }

  if (!user) {
    // Don't show loading - redirect immediately
    redirect('/login?redirectTo=' + encodeURIComponent(pathname))
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Petitions", href: "/dashboard/petitions", icon: FileText },
    { name: "Surveys", href: "/dashboard/surveys", icon: PieChart },
    { name: "Forums", href: "/dashboard/forums", icon: MessageSquare },
    { name: "Voting", href: "/dashboard/voting", icon: Vote },
    { name: "Polling", href: "/dashboard/polling", icon: BarChart2 },
    { name: "Complaints", href: "/dashboard/complaints", icon: AlertCircle },
  ]

  const userNavigation = [
    { name: "Your Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Sign out", href: "/", icon: LogOut },
  ]

  return (
    <NotificationProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex md:hidden">
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex items-center gap-2 font-bold text-xl mb-8">
                  <div className="rounded-full bg-primary p-1">
                    <PieChart className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span>VoicED</span>
                </div>
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                  <div className="my-2 border-t" />
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="rounded-full bg-primary p-1">
              <PieChart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden md:inline">VoicEd</span>
            <span className="md:hidden">VoicEd</span>
          </div>
          <nav className="mx-6 hidden md:flex md:items-center md:gap-6 lg:gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <NotificationDropdown />
            <Link href="/dashboard/profile">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=32&width=32"} alt="Profile" />
                <AvatarFallback>
                  {profile?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 md:py-8">{children}</div>
      </main>
    </div>
    </NotificationProvider>
  )
}

