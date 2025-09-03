import { useEffect } from 'react'
import type { Metric } from 'web-vitals'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

export function useWebVitals() {
  useEffect(() => {
    // Only run on production
    if (process.env.NODE_ENV !== 'production') return

    try {
      const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

      function sendToAnalytics(metric: Metric) {
        if (!process.env.NEXT_PUBLIC_ANALYTICS_ID) return

        const analyticsData = {
          dsn: process.env.NEXT_PUBLIC_ANALYTICS_ID,
          id: metric.id,
          page: window.location.pathname,
          href: window.location.href,
          event_name: metric.name,
          value: String(metric.value),
          speed: getConnectionSpeed(),
        }

        const blob = new Blob([new URLSearchParams(analyticsData as any).toString()], {
          type: 'application/x-www-form-urlencoded',
        })

        if (navigator.sendBeacon) {
          navigator.sendBeacon(vitalsUrl, blob)
        } else {
          fetch(vitalsUrl, {
            body: blob,
            method: 'POST',
            credentials: 'omit',
            keepalive: true,
          })
        }
      }

      onCLS(sendToAnalytics)
      onINP(sendToAnalytics)
      onFCP(sendToAnalytics)
      onLCP(sendToAnalytics)
      onTTFB(sendToAnalytics)
    } catch (err) {
      console.error('[Analytics]', err)
    }
  }, [])
}

function getConnectionSpeed(): string {
  if (
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    (navigator as any).connection?.effectiveType
  ) {
    return (navigator as any).connection.effectiveType
  }
  return ''
}
