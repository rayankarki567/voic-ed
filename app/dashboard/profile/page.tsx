"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  FileText,
  MessageSquare,
  PieChart,
  Vote,
  Bell,
  Lock,
  Mail,
  School,
  Calendar,
  Edit,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Rayan",
    lastName: "Karki",
    email: "022bscit034@sxc.edu.np",
    studentId: "022BSCIT034",
    department: "Computer Science",
    year: "3rd Year",
    bio: "Computer Science student interested in AI and web development. Active member of the coding club and environmental initiatives on campus.",
    phone: "+977 9863481416",
    address: "Newroad, Kathmandu",
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Mark Smith" />
                <AvatarFallback className="text-2xl">MS</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>
              {profileData.firstName} {profileData.lastName}
            </CardTitle>
            <CardDescription>{profileData.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">Student</Badge>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                {profileData.department}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined September 2023</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">{profileData.bio}</p>
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
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        {profileData.studentId}
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
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                          {profileData.department}
                        </div>
                      )}
                    </div>
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
                    <Button onClick={handleSaveProfile} className="ml-auto">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes
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

