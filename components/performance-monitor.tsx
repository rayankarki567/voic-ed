"use client"

import { useWebVitals } from '@/lib/analytics'
import { useEffect } from 'react'

interface PerformanceMonitorProps {
  children: React.ReactNode
}

export function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  // Track web vitals
  useWebVitals()

  // Track long tasks
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log long tasks (tasks that block the main thread for more than 50ms)
          if (entry.duration > 50) {
            console.warn('Long Task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            })
          }
        })
      })

      observer.observe({ entryTypes: ['longtask'] })

      return () => observer.disconnect()
    } catch (error) {
      console.error('Error setting up performance monitoring:', error)
    }
  }, [])

  // Track memory usage in development
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    
    const interval = setInterval(() => {
      const memory = (performance as any).memory
      if (memory) {
        const usedJSHeapSize = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        const jsHeapSizeLimit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        
        if (usedJSHeapSize > jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage:', {
            used: usedJSHeapSize + 'MB',
            limit: jsHeapSizeLimit + 'MB'
          })
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}
