'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { UserProfile } from '@/types/profile'
import { profileSchema } from '@/lib/validations/profile'
import { useToast } from '@/components/ui/use-toast'

export function useProfile() {
  const { user, profile, refreshSession } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    year: '',
    bio: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (user && profile) {
      setProfileData({
        name: profile.name || '',
        email: user.email || '',
        studentId: profile.student_id || '',
        department: profile.department || '',
        year: profile.year || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        address: profile.address || '',
      })
      setIsLoading(false)
    }
  }, [user, profile])

  const updateProfile = async (data: typeof profileData) => {
    try {
      setIsSaving(true)
      setErrors({})
      
      // Validate data
      const validatedData = profileSchema.parse(data)

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: validatedData.name,
          student_id: validatedData.studentId,
          department: validatedData.department,
          year: validatedData.year,
          bio: validatedData.bio,
          phone: validatedData.phone,
          address: validatedData.address,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id)

      if (error) throw error

      await refreshSession()
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
      })

      return true
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update profile',
          variant: 'destructive',
        })
      }
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return {
    profileData,
    setProfileData,
    isLoading,
    isSaving,
    errors,
    updateProfile,
    handleInputChange,
  }
}
