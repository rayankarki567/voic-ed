'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface LoadingTimeoutProps {
  children: React.ReactNode
  timeout?: number
}

export function LoadingTimeout({ children, timeout = 15000 }: LoadingTimeoutProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true)
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  if (hasTimedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading is taking longer than expected</h2>
            <p className="text-muted-foreground">
              This might be due to a slow connection or server issues. Please try refreshing the page.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              Go to Homepage
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
