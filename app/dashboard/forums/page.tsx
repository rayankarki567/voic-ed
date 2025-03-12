"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Plus, Search, ThumbsUp } from "lucide-react"

export default function ForumsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const forumTopics = [
    {
      id: 1,
      title: "Ideas for Campus Sustainability",
      description: "Share your ideas on how we can make our campus more environmentally friendly and sustainable.",
      author: "Environmental Club",
      authorAvatar: "EC",
      replies: 32,
      likes: 45,
      lastActivity: "2 hours ago",
      category: "Campus Life",
      tags: ["sustainability", "environment", "green-campus"],
    },
    {
      id: 2,
      title: "Course Registration Tips & Tricks",
      description:
        "Let's share advice on how to navigate the course registration process and get into the classes you want.",
      author: "Academic Support Group",
      authorAvatar: "AS",
      replies: 47,
      likes: 62,
      lastActivity: "5 hours ago",
      category: "Academic",
      tags: ["registration", "courses", "tips"],
    },
    {
      id: 3,
      title: "Mental Health Resources on Campus",
      description: "A discussion about available mental health resources and how to access them.",
      author: "Student Wellness Committee",
      authorAvatar: "SW",
      replies: 18,
      likes: 29,
      lastActivity: "Yesterday",
      category: "Health & Wellness",
      tags: ["mental-health", "resources", "wellness"],
    },
    {
      id: 4,
      title: "Internship Opportunities for Computer Science Students",
      description: "Share information about internship opportunities, application tips, and experiences.",
      author: "CS Student Association",
      authorAvatar: "CS",
      replies: 24,
      likes: 37,
      lastActivity: "2 days ago",
      category: "Career",
      tags: ["internships", "computer-science", "career"],
    },
  ]

  const myTopics = [
    {
      id: 5,
      title: "Study Group for Calculus II",
      description: "Looking for students interested in forming a study group for Calculus II this semester.",
      author: "Mark Smith",
      authorAvatar: "MS",
      replies: 8,
      likes: 12,
      lastActivity: "3 days ago",
      category: "Academic",
      tags: ["study-group", "calculus", "math"],
    },
  ]

  const filteredForumTopics = forumTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleViewDiscussion = (id: number) => {
    router.push(`/dashboard/forums/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Forums</h2>
          <p className="text-muted-foreground">Engage in discussions with your peers and the campus community.</p>
        </div>
        <Link href="/dashboard/forums/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Topic
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search forums..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="my">My Topics</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredForumTopics.length > 0 ? (
            <div className="grid gap-4">
              {filteredForumTopics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 text-xs">
                          <span>{topic.category}</span>
                          {topic.tags.map((tag) => (
                            <span key={tag} className="bg-muted px-1.5 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={topic.author} />
                          <AvatarFallback>{topic.authorAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{topic.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          <span>{topic.replies} replies</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          <span>{topic.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">Last activity: {topic.lastActivity}</span>
                    <Button size="sm" onClick={() => handleViewDiscussion(topic.id)}>
                      View Discussion
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No topics found</h3>
              <p className="text-muted-foreground mt-1">No topics match your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="my" className="space-y-4">
          <div className="grid gap-4">
            {myTopics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-2 text-xs">
                        <span>{topic.category}</span>
                        {topic.tags.map((tag) => (
                          <span key={tag} className="bg-muted px-1.5 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt={topic.author} />
                        <AvatarFallback>{topic.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{topic.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        <span>{topic.replies} replies</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        <span>{topic.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <span className="text-xs text-muted-foreground">Last activity: {topic.lastActivity}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => handleViewDiscussion(topic.id)}>
                      View Discussion
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4">
            {forumTopics
              .sort((a, b) => b.likes - a.likes)
              .slice(0, 3)
              .map((topic) => (
                <Card key={topic.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 text-xs">
                          <span>{topic.category}</span>
                          {topic.tags.map((tag) => (
                            <span key={tag} className="bg-muted px-1.5 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={topic.author} />
                          <AvatarFallback>{topic.authorAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{topic.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          <span>{topic.replies} replies</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          <span>{topic.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">Last activity: {topic.lastActivity}</span>
                    <Button size="sm" onClick={() => handleViewDiscussion(topic.id)}>
                      View Discussion
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

