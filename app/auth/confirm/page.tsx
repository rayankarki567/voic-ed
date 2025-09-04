'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { cleanAuthParams } from '@/lib/secure-auth'

type ConfirmationState = 'loading' | 'success' | 'error' | 'already_confirmed'

export default function ConfirmPage() {
  const [state, setState] = useState<ConfirmationState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        // Clean URL immediately to remove sensitive parameters
        setTimeout(() => {
          cleanAuthParams()
        }, 100)

        if (type === 'signup' && token_hash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email'
          })

          if (error) {
            console.error('Email confirmation error:', error)
            
            // Check if user is already confirmed
            if (error.message?.includes('already been confirmed') || 
                error.message?.includes('already confirmed')) {
              setState('already_confirmed')
              return
            }
            
            setErrorMessage(error.message || 'Failed to confirm email')
            setState('error')
            return
          }

          if (data.user) {
            console.log('Email confirmation successful:', data.user.id)
            setState('success')
            
            // Clean URL after successful confirmation
            cleanAuthParams()
          } else {
            setState('error')
            setErrorMessage('No user data received after confirmation')
          }
        } else {
          // Handle case where user visits this page directly without proper params
          setState('error')
          setErrorMessage('Invalid confirmation link or missing parameters')
        }
      } catch (error: any) {
        console.error('Unexpected error during email confirmation:', error)
        setState('error')
        setErrorMessage('An unexpected error occurred during confirmation')
      }
    }

    handleEmailConfirmation()
  }, [searchParams, supabase.auth])

  const handleContinueToLogin = () => {
    if (state === 'success') {
      router.push('/login?message=' + encodeURIComponent('Email confirmed successfully! You can now sign in.'))
    } else if (state === 'already_confirmed') {
      router.push('/login?message=' + encodeURIComponent('Your account is already confirmed. You can sign in now.'))
    } else {
      router.push('/login')
    }
  }

  const handleRetryRegistration = () => {
    router.push('/register')
  }

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Confirming your email...</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email address.
            </CardDescription>
          </>
        )

      case 'success':
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-center text-green-600">Email Confirmed! ✅</CardTitle>
            <CardDescription className="text-center">
              Your email has been successfully verified. Your account is now active and you can sign in.
            </CardDescription>
            <div className="pt-4">
              <Button onClick={handleContinueToLogin} className="w-full">
                Continue to Sign In
              </Button>
            </div>
          </>
        )

      case 'already_confirmed':
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center text-blue-600">Already Confirmed</CardTitle>
            <CardDescription className="text-center">
              Your email address has already been confirmed. You can sign in to your account.
            </CardDescription>
            <div className="pt-4">
              <Button onClick={handleContinueToLogin} className="w-full">
                Go to Sign In
              </Button>
            </div>
          </>
        )

      case 'error':
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-center text-red-600">Confirmation Failed</CardTitle>
            <CardDescription className="text-center">
              {errorMessage || 'Unable to confirm your email address.'}
            </CardDescription>
            <div className="pt-4 space-y-2">
              <Button onClick={handleRetryRegistration} variant="outline" className="w-full">
                Try Registration Again
              </Button>
              <Button onClick={handleContinueToLogin} className="w-full">
                Go to Sign In
              </Button>
            </div>
          </>
        )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {renderContent()}
        </CardHeader>
      </Card>
    </div>
  )
}
