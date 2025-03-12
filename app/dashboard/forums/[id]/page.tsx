"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, ThumbsUp, Clock, Flag, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForumDiscussionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [replyText, setReplyText] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">("newest")

  // In a real app, this would come from an API call using the ID
  const discussionId = Number(params.id)

  const discussion = {
    id: discussionId,
    title: "Ideas for Campus Sustainability",
    description:
      "Share your ideas on how we can make our campus more environmentally friendly and sustainable. I'm particularly interested in low-cost initiatives that could be implemented quickly to reduce our carbon footprint and promote sustainability awareness among students.",
    author: "Environmental Club",
    authorAvatar: "EC",
    authorRole: "Student Organization",
    createdAt: "May 15, 2025",
    lastActivity: "2 hours ago",
    category: "Campus Life",
    tags: ["sustainability", "environment", "green-campus"],
    views: 342,
    likes: 45,
    isLiked: false,
    isPinned: true,
    replies: [
      {
        id: 1,
        author: "Jane Doe",
        authorAvatar: "JD",
        authorRole: "Student",
        content:
          "I think we should install more water bottle refill stations across campus to reduce plastic waste. The ones we have now are always busy and not conveniently located for everyone.",
        timestamp: "May 16, 2025 • 10:23 AM",
        likes: 28,
        isLiked: false,
        replies: [
          {
            id: 11,
            author: "Environmental Club",
            authorAvatar: "EC",
            authorRole: "Student Organization",
            content:
              "That's a great idea! We've actually been discussing this with the administration. Do you have specific locations in mind where these would be most useful?",
            timestamp: "May 16, 2025 • 11:05 AM",
            likes: 12,
            isLiked: false,
          },
          {
            id: 12,
            author: "Alex Johnson",
            authorAvatar: "AJ",
            authorRole: "Student",
            content:
              "The library definitely needs one on each floor. I also think the gym and all major academic buildings should have them.",
            timestamp: "May 16, 2025 • 12:30 PM",
            likes: 15,
            isLiked: false,
          },
        ],
      },
      {
        id: 2,
        author: "Prof. Williams",
        authorAvatar: "PW",
        authorRole: "Faculty",
        content:
          "The Biology department has been working on a campus garden project that could use student volunteers. It would be a great way to promote sustainability and provide fresh produce for the campus community.",
        timestamp: "May 16, 2025 • 2:45 PM",
        likes: 32,
        isLiked: false,
        isOfficial: true,
        replies: [],
      },
      {
        id: 3,
        author: "Mark Smith",
        authorAvatar: "MS",
        authorRole: "Student",
        content:
          "We should organize a sustainability week with workshops, speakers, and activities to raise awareness about environmental issues and sustainable practices.",
        timestamp: "May 17, 2025 • 9:15 AM",
        likes: 18,
        isLiked: false,
        replies: [],
      },
      {
        id: 4,
        author: "Sarah Chen",
        authorAvatar: "SC",
        authorRole: "Student",
        content:
          "I'd like to see more bike racks and maybe even a bike-sharing program on campus. This would encourage more people to bike instead of drive to campus.",
        timestamp: "May 17, 2025 • 3:20 PM",
        likes: 22,
        isLiked: false,
        replies: [],
      },
    ],
    relatedDiscussions: [
      { id: 2, title: "Campus Recycling Program Improvements", replies: 24 },
      { id: 3, title: "Solar Panels for Campus Buildings", replies: 18 },
      { id: 4, title: "Reducing Food Waste in Dining Halls", replies: 31 },
    ],
  }

  const handleSubmitReply = (e: React.FormEvent, parentId?: number) => {
    e.preventDefault()
    if (replyText.trim()) {
      toast({
        title: "Reply Posted",
        description: "Your reply has been added to the discussion.",
      })
      setReplyText("")
      // In a real app, this would post to an API
    }
  }

  const handleLike = (type: "discussion" | "reply", id: number) => {
    toast({
      title: "Liked",
      description: "Your like has been recorded.",
    })
    // In a real app, this would update the like count via API
  }

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting this content. A moderator will review it shortly.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Discussion link has been copied to clipboard.",
    })
  }

  const sortedReplies = [...discussion.replies].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    } else if (sortOrder === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    } else {
      return b.likes - a.likes
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/forums")}>
          <ArrowLeft className="h-4 w-4" /> Back to Forums
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {discussion.isPinned && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">
                        Pinned
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-muted border-0">
                      {discussion.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleReport}>
                      <Flag className="h-4 w-4" />
                      <span className="sr-only">Report</span>
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl">{discussion.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={discussion.author} />
                    <AvatarFallback>{discussion.authorAvatar}</AvatarFallback>
                  </Avatar>
                  <CardDescription>
                    Posted by <span className="font-medium">{discussion.author}</span> • {discussion.createdAt}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-muted/50 hover:bg-muted">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{discussion.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleLike("discussion", discussion.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{discussion.likes} likes</span>
                </Button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{discussion.replies.length} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last activity: {discussion.lastActivity}</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Replies</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    className="text-sm bg-transparent border-none focus:outline-none cursor-pointer"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "popular")}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Add your reply..."
                  className="min-h-[100px]"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!replyText.trim()}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Post Reply
                  </Button>
                </div>
              </form>

              <div className="space-y-6">
                {sortedReplies.map((reply) => (
                  <div key={reply.id} className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={reply.author} />
                          <AvatarFallback>{reply.authorAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{reply.author}</span>
                            <span className="text-xs text-muted-foreground">{reply.authorRole}</span>
                            {reply.isOfficial && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-0">
                                Official Response
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{reply.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{reply.timestamp}</span>
                            <button
                              className="flex items-center gap-1 hover:text-foreground"
                              onClick={() => handleLike("reply", reply.id)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {reply.likes} likes
                            </button>
                            <button
                              className="hover:text-foreground"
                              onClick={() => {
                                setReplyText(`@${reply.author} `)
                                document.querySelector("textarea")?.focus()
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {reply.replies && reply.replies.length > 0 && (
                      <div className="ml-12 space-y-4">
                        {reply.replies.map((nestedReply) => (
                          <div key={nestedReply.id} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={nestedReply.author} />
                                <AvatarFallback>{nestedReply.authorAvatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{nestedReply.author}</span>
                                  <span className="text-xs text-muted-foreground">{nestedReply.authorRole}</span>
                                </div>
                                <p className="text-sm">{nestedReply.content}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>{nestedReply.timestamp}</span>
                                  <button
                                    className="flex items-center gap-1 hover:text-foreground"
                                    onClick={() => handleLike("reply", nestedReply.id)}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    {nestedReply.likes} likes
                                  </button>
                                  <button
                                    className="hover:text-foreground"
                                    onClick={() => {
                                      setReplyText(`@${nestedReply.author} `)
                                      document.querySelector("textarea")?.focus()
                                    }}
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discussion Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-xl font-medium">{discussion.views}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Replies</p>
                  <p className="text-xl font-medium">{discussion.replies.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <p className="text-xl font-medium">{discussion.likes}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-xl font-medium">{discussion.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt={discussion.author} />
                  <AvatarFallback className="text-lg">{discussion.authorAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{discussion.author}</p>
                  <p className="text-sm text-muted-foreground">{discussion.authorRole}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The Environmental Club is a student organization dedicated to promoting sustainability and environmental
                awareness on campus.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussion.relatedDiscussions.map((related) => (
                <div key={related.id} className="group">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm font-medium text-left group-hover:text-primary group-hover:underline"
                    onClick={() => router.push(`/dashboard/forums/${related.id}`)}
                  >
                    {related.title}
                  </Button>
                  <p className="text-xs text-muted-foreground">{related.replies} replies</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Forum Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Be respectful and considerate of others' opinions.</li>
                <li>Stay on topic and contribute meaningfully to discussions.</li>
                <li>No spam, offensive content, or personal attacks.</li>
                <li>Use appropriate language and formatting.</li>
                <li>Report any violations or concerns to moderators.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

