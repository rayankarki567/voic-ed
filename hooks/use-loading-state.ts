'use client'

import { useEffect, useState } from 'react'

export function useTimeout(callback: () => void, delay: number | null) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(callback, delay)
      setTimeoutId(id)
      return () => {
        clearTimeout(id)
        setTimeoutId(null)
      }
    }
  }, [callback, delay])

  const clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  return clear
}

export function useLoadingState(initialLoading = true, timeout = 10000) {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [hasTimedOut, setHasTimedOut] = useState(false)

  const clearTimeout = useTimeout(() => {
    if (isLoading) {
      setHasTimedOut(true)
      console.warn('Loading timed out after', timeout, 'ms')
    }
  }, isLoading ? timeout : null)

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
    if (!loading) {
      setHasTimedOut(false)
      clearTimeout()
    }
  }

  const reset = () => {
    setIsLoading(initialLoading)
    setHasTimedOut(false)
  }

  return {
    isLoading,
    hasTimedOut,
    setLoading,
    reset
  }
}
