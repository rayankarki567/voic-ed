"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, AlertTriangle, Clock, MessageSquare, ThumbsUp, UserCheck, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PetitionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [hasSignedPetition, setHasSignedPetition] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentSignatures, setCurrentSignatures] = useState(45) // Track signatures locally

  // In a real app, this would come from an API call using the ID
  const petitionId = Number(params.id)

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // 1 second loading

    return () => clearTimeout(timer)
  }, [])

  // Set initial signatures based on petition ID
  useEffect(() => {
    const getInitialSignatures = (id: number) => {
      switch (id) {
        case 1: return 45
        case 2: return 68
        case 3: return 92
        default: return 45
      }
    }
    setCurrentSignatures(getInitialSignatures(petitionId))
  }, [petitionId])

  const petition = {
    id: petitionId,
    title: "Extend Library Hours During Exam Period",
    description:
      "We request the university to extend library hours to 24/7 during the final exam period to accommodate students' study needs. This would greatly benefit students who prefer studying in the library environment and need access to resources that may not be available elsewhere. Extended hours would also help alleviate overcrowding during peak study times.",
    creator: "Mark Smith",
    creatorRole: "Student",
    signatures: currentSignatures, // Use the state value instead of hardcoded
    goal: 100,
    daysRemaining: 15,
    category: "Academic",
    createdAt: "May 5, 2025",
    status: "Under Review",
    lastUpdated: "May 10, 2025",
    reviewedBy: "Academic Affairs Committee",
    escalationHistory: [
      {
        date: "May 8, 2025",
        action: "Automatic escalation to Dean of Students",
        reason: "No response from Department Head within 3 days",
      },
    ],
    supportingDocuments: [
      { name: "Student Survey Results.pdf", size: "2.4 MB" },
      { name: "Library Current Schedule.docx", size: "1.1 MB" },
    ],
    comments: [
      {
        id: 1,
        user: "Jane Doe",
        role: "Student",
        avatar: "JD",
        text: "This would be extremely helpful during finals week!",
        timestamp: "3 days ago",
        likes: 12,
      },
      {
        id: 2,
        user: "Prof. Johnson",
        role: "Faculty",
        avatar: "PJ",
        text: "I support this initiative and will discuss it with the library staff.",
        timestamp: "2 days ago",
        likes: 8,
        isOfficial: true,
      },
    ],
    recentSigners: [
      { name: "Alex Chen", avatar: "AC", timestamp: "1 hour ago" },
      { name: "Sarah Wilson", avatar: "SW", timestamp: "3 hours ago" },
      { name: "Mike Brown", avatar: "MB", timestamp: "yesterday" },
    ],
  }

  const handleSignPetition = () => {
    if (!hasSignedPetition) {
      setCurrentSignatures(prev => prev + 1) // Increment signature count
      setHasSignedPetition(true)
      toast({
        title: "Petition Signed",
        description: "Thank you for supporting this petition!",
      })
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the discussion.",
      })
      setCommentText("")
      // In a real app, this would post to an API
    }
  }

  // Show loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading petition details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/petitions")}>
          <ArrowLeft className="h-4 w-4" /> Back to Petitions
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{petition.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Created by {petition.creator} • {petition.category} • {petition.createdAt}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">
                    {petition.status}
                  </Badge>
                  {petition.escalationHistory.length > 0 && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-0 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Escalated
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{petition.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{petition.signatures} signatures</span>
                  <span>Goal: {petition.goal}</span>
                </div>
                <Progress value={(petition.signatures / petition.goal) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{petition.daysRemaining} days remaining</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Last updated: {petition.lastUpdated}
                  </span>
                </div>
              </div>

              {petition.reviewedBy && (
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Review Status</h4>
                  <p className="text-sm text-muted-foreground">
                    This petition is currently being reviewed by the {petition.reviewedBy}.
                  </p>
                </div>
              )}

              {petition.escalationHistory.length > 0 && (
                <div className="border border-amber-200 bg-amber-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-amber-800 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Escalation History
                  </h4>
                  <div className="space-y-2">
                    {petition.escalationHistory.map((escalation, index) => (
                      <div key={index} className="text-sm">
                        <p className="text-amber-800">
                          {escalation.date} - {escalation.action}
                        </p>
                        <p className="text-amber-700 text-xs">{escalation.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {petition.supportingDocuments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Supporting Documents</h4>
                  <div className="space-y-2">
                    {petition.supportingDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="text-sm">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{doc.size}</span>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{petition.signatures} supporters</span>
              </div>
              {!hasSignedPetition ? (
                <Button onClick={handleSignPetition}>Sign this Petition</Button>
              ) : (
                <Button variant="outline" disabled className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> Signed
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Discussion</CardTitle>
              <CardDescription>Share your thoughts and discuss this petition with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Add your comment..."
                  className="min-h-[100px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!commentText.trim()}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Post Comment
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {petition.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={comment.user} />
                        <AvatarFallback>{comment.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">{comment.role}</span>
                          {comment.isOfficial && (
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-0">
                              Official Response
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{comment.text}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{comment.timestamp}</span>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {comment.likes} likes
                          </button>
                          <button className="hover:text-foreground">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Supporters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {petition.recentSigners.map((signer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={signer.name} />
                      <AvatarFallback>{signer.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{signer.name}</p>
                      <p className="text-xs text-muted-foreground">{signer.timestamp}</p>
                    </div>
                  </div>
                ))}
                {petition.signatures > 3 && (
                  <Button variant="ghost" size="sm" className="w-full">
                    View all {petition.signatures} supporters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share this Petition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.718 10.528c0 .792-.268 1.829-.684 2.642-1.009 1.98-3.063 1.967-3.063-.14 0-.786.27-1.799.687-2.58 1.021-1.925 3.06-1.624 3.06.078zm10.282 1.472c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5-1.194c0-3.246-2.631-5.799-6.256-5.799-3.967 0-6.744 2.937-6.744 6.75 0 2.125.6 3.854 1.33 5.104 1.653 2.806 4.636 4.139 8.345 4.139.625 0 1.218-.051 1.78-.15 1.8-.307 3.39-.992 4.698-1.932.45-.327.723-.793.6-1.301-.118-.506-.543-.869-1.042-.896-1.499-.098-1.436-1.193-1.432-1.292.28-.744-.089-1.535-.81-1.935-.096-.053-.192-.076-.382-.075-.135.089-.324.058-.438.134-.41.054-.522.014-.373-.312.367-.674.729-1.023.614-1.512-.048-.204-.18-.32-.385-.32-.294-.001-.583.147-.727.382-.49.797-1.14 1.744-1.516 2.229-.219.284-.313.178-.313-.168zm1.534 1.116c-.295-.01-.576.136-.723.384-.346.588-.636 1.129-.878 1.591-.241.461-.364.391-.364-.19 0-1.36.197-2.023 0-2.301-.13-.19-.326-.236-.513-.236h-.14c-1.8.79-3.075 1.196-3.048-.156.006-.348.147-.644.42-.881.273-.236.737-.38 1.154-.331.417.05.793.235 1.067.556.161.186.25.379.25.581 0 .443.324.322.484.209.459-.31.75-.725.947-1.306.197-.581.231-1.269.126-1.956-.099-.514-.341-.954-.739-1.303-.41-.36-.94-.595-1.454-.671-1.717-.198-3.349.468-4.358 2.318-.93 1.616-1.029 3.812-.259 5.44.802 1.695 2.483 2.804 4.357 2.671 1.626-.13 3.234-.449 4.72-1.04 1.161-.465.525-1.953-.599-1.761-.684.12-1.404.248-2.136.284z"></path>
                  </svg>
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                  YouTube
                </Button>
              </div>
              <div className="pt-2">
                <Button variant="secondary" className="w-full">
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Petitions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="group">
                  <Link
                    href="/dashboard/petitions/2"
                    className="text-sm font-medium group-hover:text-primary group-hover:underline"
                  >
                    24/7 Study Spaces in Student Center
                  </Link>
                  <p className="text-xs text-muted-foreground">68 signatures</p>
                </div>
                <div className="group">
                  <Link
                    href="/dashboard/petitions/3"
                    className="text-sm font-medium group-hover:text-primary group-hover:underline"
                  >
                    More Power Outlets in Library Study Areas
                  </Link>
                  <p className="text-xs text-muted-foreground">92 signatures</p>
                </div>
                <div className="group">
                  <Link
                    href="/dashboard/petitions/4"
                    className="text-sm font-medium group-hover:text-primary group-hover:underline"
                  >
                    Quiet Study Floor Policy Enforcement
                  </Link>
                  <p className="text-xs text-muted-foreground">37 signatures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

