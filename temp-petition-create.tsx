"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, FileText, Users, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import type { Database } from '@/types/database.types'

interface PetitionFormData {
  title: string
  description: string
  category: string
  targetSignatures: number
  duration: number
}

export default function CreatePetitionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PetitionFormData>({
    title: '',
    description: '',
    category: '',
    targetSignatures: 100,
    duration: 30
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PetitionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to create a petition')
      }

      // Insert the petition
      const { data, error } = await supabase
        .from('petitions')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          user_id: user.id,
          target_signatures: formData.targetSignatures,
          current_signatures: 0,
          status: 'active',
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your petition has been created successfully.",
        variant: "default",
      })

      // Redirect to the petitions page
      router.push("/dashboard/petitions")
    } catch (error: any) {
      console.error('Error creating petition:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create petition. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2" 
          onClick={() => router.push("/dashboard/petitions")}
        >
          <ArrowLeft className="h-4 w-4" /> 
          Back to Petitions
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Create a Petition</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start a petition to make a positive change in your campus community. 
          Be clear, specific, and passionate about your cause.
        </p>
      </div>

      {/* Main Form */}
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Petition Details</CardTitle>
                <CardDescription className="text-base">
                  Provide clear and compelling information to gather support for your cause.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Title Section */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-medium">
                Petition Title <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a clear, specific title for your petition"
                className={`text-lg py-3 ${errors.title ? 'border-destructive' : ''}`}
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                {errors.title ? (
                  <span className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Be specific and compelling
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            <Separator />

            {/* Category Section */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger id="category" className={`${errors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select the most relevant category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">🎓 Academic</SelectItem>
                  <SelectItem value="campus-life">🏫 Campus Life</SelectItem>
                  <SelectItem value="infrastructure">🏗️ Infrastructure</SelectItem>
                  <SelectItem value="sustainability">🌱 Sustainability</SelectItem>
                  <SelectItem value="student-services">📋 Student Services</SelectItem>
                  <SelectItem value="technology">💻 Technology</SelectItem>
                  <SelectItem value="health-wellness">🏥 Health & Wellness</SelectItem>
                  <SelectItem value="other">📝 Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <span className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.category}
                </span>
              )}
            </div>

            <Separator />

            {/* Description Section */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Explain the issue clearly and what change you want to see. Include why this matters and what specific action you're requesting."
                className={`min-h-[160px] resize-none ${errors.description ? 'border-destructive' : ''}`}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {errors.description ? (
                  <span className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Clear explanation helps gather more support
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {formData.description.length}/1000
                </span>
              </div>
            </div>

            <Separator />

            {/* Goals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="goal" className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Signature Goal
                </Label>
                <Select onValueChange={(value) => handleInputChange('targetSignatures', parseInt(value))}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 signatures</SelectItem>
                    <SelectItem value="100">100 signatures</SelectItem>
                    <SelectItem value="200">200 signatures</SelectItem>
                    <SelectItem value="300">300 signatures</SelectItem>
                    <SelectItem value="500">500 signatures</SelectItem>
                    <SelectItem value="1000">1000 signatures</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Set a realistic but ambitious target
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="duration" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duration
                </Label>
                <Select onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How long should this petition run?
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {formData.title && formData.description && (
              <>
                <Separator />
                <div className="space-y-4 p-6 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Preview
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">{formData.title}</h3>
                    {formData.category && (
                      <Badge variant="secondary" className="w-fit">
                        {formData.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                    )}
                    <p className="text-muted-foreground leading-relaxed">
                      {formData.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Goal: {formData.targetSignatures} signatures
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Duration: {formData.duration} days
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.push("/dashboard/petitions")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Petition
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
