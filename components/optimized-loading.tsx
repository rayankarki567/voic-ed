import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

interface DeferredLoadProps {
  children: React.ReactNode
  placeholder?: React.ReactNode
  threshold?: number
}

export function DeferredLoad({ 
  children, 
  placeholder, 
  threshold = 0.1 
}: DeferredLoadProps) {
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      setLoaded(true)
    }
  }, [inView])

  return (
    <div ref={ref}>
      {loaded ? children : placeholder}
    </div>
  )
}

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}: OptimizedImageProps) {
  // For placeholder images, generate blur data URL
  const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRsdHSIgIRwhICEhISEgHyEhISEfICAgICAhICAgICAgIiIiIiIiIiIiIiIiIiL/2wBDAR8XFx0aHR4hICEiJCIkIiUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSX/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{ 
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover'
      }}
    />
  )
}

export function LazyComponent<T extends object>({ 
  factory,
  fallback,
  props
}: { 
  factory: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode,
  props: T
}) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0
  })

  useEffect(() => {
    if (inView) {
      factory().then(module => {
        setComponent(() => module.default)
      })
    }
  }, [factory, inView])

  return (
    <div ref={ref}>
      {Component ? <Component {...props} /> : fallback}
    </div>
  )
}
