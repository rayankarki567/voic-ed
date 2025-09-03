"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/supabase-auth'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Bell, Calendar, CheckCircle2, Edit, FileText, Lock, Mail, MessageSquare, PieChart, School, Vote } from 'lucide-react'
import { PrivacySettings } from '@/components/privacy-settings'
import { NotificationSettings } from '@/components/notification-settings'
import { ChangePassword } from '@/components/change-password'
import { Badge } from "@/components/ui/badge"
import type { UserProfile, ProfileFormData } from '@/types/profile'
import { z } from 'zod'

const mapProfileToFormData = (profile: any, email: string): ProfileFormData => ({
  firstName: profile?.first_name || '',
  lastName: profile?.last_name || '',
  email: email || '',
  studentId: profile?.student_id || '',
  department: profile?.department || '',
  year: profile?.year || '',
  bio: profile?.bio || '',
  phone: profile?.phone || '',
  address: profile?.address || '',
})

export default function ProfilePage() {
  const { user, profile, refreshSession } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const supabase = createClientComponentClient()
  
  const [profileData, setProfileData] = useState<ProfileFormData>(() => {
    console.log("Initial profile data:", profile)
    return mapProfileToFormData(profile, user?.email || '')
  })

  // Check if we need to create a profile for new users (especially Google OAuth)
  useEffect(() => {
    const createProfileForNewUser = async () => {
      if (user && !profile && !isCreatingProfile) {
        setIsCreatingProfile(true)
        
        try {
          // Extract name from user metadata (Google OAuth provides this)
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
          const firstName = user.user_metadata?.given_name || fullName.split(' ')[0] || ''
          const lastName = user.user_metadata?.family_name || fullName.split(' ').slice(1).join(' ') || ''
          const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

          console.log('Creating profile for new user:', {
            userId: user.id,
            email: user.email,
            firstName,
            lastName,
            avatarUrl,
            userMetadata: user.user_metadata
          })

          console.log('Testing auth status before insert...')
          const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
          
          if (authError) {
            console.error('Auth error:', authError)
            throw new Error(`Authentication error: ${authError.message}`)
          }
          
          if (!currentUser) {
            throw new Error('No authenticated user found')
          }
          
          console.log('Current authenticated user:', currentUser.id)

          // Try a simple insert first
          console.log('Attempting to insert profile...')
          const profileData = {
            user_id: user.id,
            first_name: firstName || 'User',
            last_name: lastName || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          console.log('Profile data to insert:', profileData)

          const { data: insertedProfile, error: profileError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select()

          if (profileError) {
            console.error('Error creating profile:', profileError)
            console.error('Profile error details:', {
              code: profileError.code,
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              fullError: JSON.stringify(profileError, null, 2)
            })
            
            // Try to get more information about the error
            if (profileError.code) {
              console.error(`Database error code: ${profileError.code}`)
            }
            
            throw new Error(`Profile creation failed: ${profileError.message || profileError.code || 'Unknown database error'}`)
          }

          console.log('Profile created successfully:', insertedProfile)

          // Create security settings (optional - don't fail if this doesn't work)
          console.log('Attempting to create security settings...')
          const securityData = {
            user_id: user.id,
            two_factor_enabled: false,
            failed_login_attempts: 0,
            profile_visibility: 'public',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          console.log('Security data to insert:', securityData)
          
          const { data: insertedSecurity, error: securityError } = await supabase
            .from('security_settings')
            .insert(securityData)
            .select()

          if (securityError) {
            console.error('Error creating security settings:', securityError)
            console.error('Security error details:', {
              code: securityError.code,
              message: securityError.message,
              details: securityError.details,
              hint: securityError.hint,
              fullError: JSON.stringify(securityError, null, 2)
            })
            // Don't throw here, profile creation is more important
            console.warn('Security settings creation failed, but continuing with profile setup')
          } else {
            console.log('Security settings created successfully:', insertedSecurity)
          }

          // Refresh the session to get the new profile data
          await refreshSession()
          
          toast({
            title: "Welcome!",
            description: "Your profile has been created. Please complete your information.",
            duration: 5000,
          })
          
          setIsEditing(true) // Start in edit mode for new users
        } catch (error: any) {
          console.error('Failed to create profile:', error)
          console.error('Error details:', {
            name: error?.name,
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            stack: error?.stack
          })
          
          const errorMessage = error?.message || 'Unknown error occurred during profile creation'
          
          toast({
            title: "Profile Creation Error",
            description: `Failed to create your profile: ${errorMessage}. Please check the browser console and try refreshing the page.`,
            variant: "destructive",
          })
        } finally {
          setIsCreatingProfile(false)
        }
      }
    }

    createProfileForNewUser()
  }, [user, profile, isCreatingProfile, refreshSession, supabase, toast])

  // Update profileData when profile changes
  useEffect(() => {
    if (profile) {
      setProfileData(mapProfileToFormData(profile, user?.email || ''))
    }
  }, [profile, user?.email])

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    surveyReminders: true,
    petitionUpdates: true,
    forumReplies: true,
    votingReminders: true,
  })

  const recentActivity = [
    { type: "petition", action: "signed", title: "More Options in Cafeteria", date: "2 days ago" },
    { type: "forum", action: "posted", title: "Ideas for Open Source Community", date: "4 days ago" },
    { type: "survey", action: "completed", title: "Campus Dining Options", date: "1 week ago" },
    { type: "vote", action: "participated", title: "Student Council Elections", date: "2 weeks ago" },
  ]

  const validateStudentId = (studentId: string): boolean => {
    // Student ID format: 202CS001 (3 digits + letters + 3 digits)
    const studentIdRegex = /^[0-9]{3}[A-Za-z]+[0-9]{3}$/
    return studentId === '' || studentIdRegex.test(studentId)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev: ProfileFormData) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    if (!user) {
      console.error("No user found")
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive"
      })
      return
    }

    // Validate student ID format if provided
    if (profileData.studentId && !validateStudentId(profileData.studentId)) {
      toast({
        title: "Invalid Student ID",
        description: "Student ID must be in format: 3 digits + letters + 3 digits (e.g., 202CS001)",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    console.log("Saving profile data:", profileData)
    
    try {
      const updateData: any = {
        first_name: profileData.firstName.trim(),
        last_name: profileData.lastName.trim(),
        department: profileData.department.trim(),
        year: profileData.year,
        bio: profileData.bio.trim(),
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
        updated_at: new Date().toISOString()
      }

      // Only include student_id if it's provided and valid
      if (profileData.studentId) {
        updateData.student_id = profileData.studentId.trim().toUpperCase()
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id)

      if (error) {
        console.error("Supabase error:", error)
        
        // Handle specific database errors
        if (error.code === '23505' && error.message.includes('student_id')) {
          throw new Error('This student ID is already in use. Please use a different one.')
        }
        
        throw error
      }

      console.log("Profile updated successfully")
      await refreshSession()
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: error.message || "There was an error updating your profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleNotification = (setting: string, checked: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: checked,
    }))

    toast({
      title: "Notification Settings Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, " $1")} ${checked ? "enabled" : "disabled"}.`,
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "petition":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "forum":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "survey":
        return <PieChart className="h-4 w-4 text-purple-500" />
      case "vote":
        return <Vote className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  if (isCreatingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h3 className="text-lg font-medium">Setting up your profile...</h3>
          <p className="text-muted-foreground">
            We're creating your profile based on your account information.
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">Authentication Required</h3>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  // Extract initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        {!profile && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            Profile Incomplete
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} 
                  alt={`${profileData.firstName} ${profileData.lastName}`} 
                />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(profileData.firstName, profileData.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {profileData.firstName || profileData.lastName ? 
                `${profileData.firstName} ${profileData.lastName}`.trim() : 
                'Complete Your Profile'
              }
            </CardTitle>
            <CardDescription className="flex items-center gap-1 justify-center">
              <Mail className="h-4 w-4" />
              {profileData.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                {user?.user_metadata?.role || 'Student'}
              </Badge>
              {profileData.department && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                  {profileData.department}
                </Badge>
              )}
            </div>

            {(profileData.year || profileData.studentId) && (
              <div className="space-y-2 text-sm">
                {profileData.studentId && (
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span>ID: {profileData.studentId}</span>
                  </div>
                )}
                {profileData.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Year {profileData.year}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              {profileData.bio ? (
                <p className="text-sm text-muted-foreground">{profileData.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Add a bio to tell others about yourself
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant={isEditing ? "outline" : "default"}
              className="w-full"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>Cancel Editing</>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>
                    {isEditing ? "Edit your personal details below" : "Your personal details and contact information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                          {profileData.firstName}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                          {profileData.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        {profileData.email}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input
                            id="studentId"
                            name="studentId"
                            value={profileData.studentId}
                            onChange={handleInputChange}
                            placeholder="e.g., 202CS001"
                            className={!validateStudentId(profileData.studentId) ? "border-destructive" : ""}
                          />
                          {profileData.studentId && !validateStudentId(profileData.studentId) && (
                            <p className="text-sm text-destructive">
                              Format: 3 digits + letters + 3 digits (e.g., 202CS001)
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Format: Year + Department code + Number (e.g., 202CS001)
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                          {profileData.studentId || (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      {isEditing ? (
                        <Input
                          id="year"
                          name="year"
                          value={profileData.year}
                          onChange={handleInputChange}
                          placeholder="e.g., 2, 3, 4"
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                          {profileData.year || (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        name="department"
                        value={profileData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science, Business Administration"
                      />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        {profileData.department || (
                          <span className="text-muted-foreground italic">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <div className="p-3 rounded-md border bg-muted/50 min-h-[100px]">{profileData.bio}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        {profileData.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Campus Address</Label>
                    {isEditing ? (
                      <Input id="address" name="address" value={profileData.address} onChange={handleInputChange} />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        {profileData.address}
                      </div>
                    )}
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter>
                    <Button 
                      onClick={handleSaveProfile} 
                      className="ml-auto min-w-[120px]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Your recent interactions with the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="rounded-full bg-muted p-2">{getActivityIcon(activity.type)}</div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            You {activity.action} {activity.type === "forum" ? "in" : "the"} "{activity.title}"
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Petitions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Extend Library Hours</p>
                          <p className="text-xs text-muted-foreground">45/100 signatures</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Forum Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Study Group for Calculus II</p>
                          <p className="text-xs text-muted-foreground">8 replies</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailNotifications" className="font-normal">
                          Email Notifications
                        </Label>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleToggleNotification("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="pushNotifications" className="font-normal">
                          Push Notifications
                        </Label>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleToggleNotification("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="surveyReminders" className="font-normal">
                          Survey Reminders
                        </Label>
                      </div>
                      <Switch
                        id="surveyReminders"
                        checked={notificationSettings.surveyReminders}
                        onCheckedChange={(checked) => handleToggleNotification("surveyReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="petitionUpdates" className="font-normal">
                          Petition Updates
                        </Label>
                      </div>
                      <Switch
                        id="petitionUpdates"
                        checked={notificationSettings.petitionUpdates}
                        onCheckedChange={(checked) => handleToggleNotification("petitionUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="forumReplies" className="font-normal">
                          Forum Replies
                        </Label>
                      </div>
                      <Switch
                        id="forumReplies"
                        checked={notificationSettings.forumReplies}
                        onCheckedChange={(checked) => handleToggleNotification("forumReplies", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Vote className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="votingReminders" className="font-normal">
                          Voting Reminders
                        </Label>
                      </div>
                      <Switch
                        id="votingReminders"
                        checked={notificationSettings.votingReminders}
                        onCheckedChange={(checked) => handleToggleNotification("votingReminders", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Account Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex items-center gap-2">
                      <Input id="password" type="password" value="••••••••" disabled />
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <Button variant="outline" size="sm">
                        <Lock className="mr-2 h-4 w-4" /> Enable
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <p className="text-xs text-muted-foreground">Control who can see your profile information</p>
                    </div>
                    <select
                      id="profileVisibility"
                      className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="public">Public</option>
                      <option value="students">Students Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activityVisibility">Activity Visibility</Label>
                      <p className="text-xs text-muted-foreground">Control who can see your activity on the platform</p>
                    </div>
                    <select
                      id="activityVisibility"
                      className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="public">Public</option>
                      <option value="students">Students Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

