"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PieChart, Plus, Search, CheckCircle, Clock, ChevronRight, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function PollingPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  const activePolls = [
    {
      id: 1,
      title: "Preferred Study Space Improvements",
      description: "What improvements would you most like to see in campus study spaces?",
      creator: "Student Services",
      expiresIn: "2 days",
      options: [
        { id: "a", text: "More power outlets", votes: 145 },
        { id: "b", text: "Better lighting", votes: 87 },
        { id: "c", text: "More comfortable seating", votes: 112 },
        { id: "d", text: "Quieter environment", votes: 96 },
      ],
      totalVotes: 440,
      threshold: 400,
      metThreshold: true,
      forwardedTo: "Campus Planning Committee",
      category: "Facilities",
    },
    {
      id: 2,
      title: "New Club Interest Survey",
      description: "Which new student club would you be most interested in joining?",
      creator: "Student Activities Office",
      expiresIn: "5 days",
      options: [
        { id: "a", text: "Debate Club", votes: 56 },
        { id: "b", text: "Film Production Society", votes: 89 },
        { id: "c", text: "Entrepreneurship Network", votes: 102 },
        { id: "d", text: "Culinary Arts Club", votes: 71 },
      ],
      totalVotes: 318,
      threshold: 500,
      metThreshold: false,
      category: "Student Life",
    },
    {
      id: 3,
      title: "Cafeteria Menu Additions",
      description: "What new food option would you like to see added to the cafeteria menu?",
      creator: "Dining Services",
      expiresIn: "3 days",
      options: [
        { id: "a", text: "More vegan options", votes: 134 },
        { id: "b", text: "International cuisine station", votes: 187 },
        { id: "c", text: "Build-your-own sandwich bar", votes: 156 },
        { id: "d", text: "Health-focused smoothie bar", votes: 122 },
      ],
      totalVotes: 599,
      threshold: 500,
      metThreshold: true,
      forwardedTo: "Food Service Director",
      category: "Dining",
    },
  ]

  const closedPolls = [
    {
      id: 4,
      title: "Preferred Final Exam Schedule Format",
      description: "Which final exam schedule format would you prefer for the upcoming semester?",
      creator: "Academic Affairs",
      closedDate: "April 15, 2025",
      result: {
        winning: "Condensed schedule (1 week)",
        percentage: 64,
      },
      options: [
        { id: "a", text: "Condensed schedule (1 week)", votes: 423, percentage: 64 },
        { id: "b", text: "Extended schedule (2 weeks)", votes: 238, percentage: 36 },
      ],
      totalVotes: 661,
      implemented: true,
      category: "Academic",
    },
    {
      id: 5,
      title: "Campus Event Preference",
      description: "What type of campus-wide event would you most like to see organized?",
      creator: "Student Union",
      closedDate: "March 28, 2025",
      result: {
        winning: "Music festival",
        percentage: 47,
      },
      options: [
        { id: "a", text: "Music festival", votes: 312, percentage: 47 },
        { id: "b", text: "Cultural fair", votes: 187, percentage: 28 },
        { id: "c", text: "Career networking event", votes: 96, percentage: 14 },
        { id: "d", text: "Outdoor movie night", votes: 74, percentage: 11 },
      ],
      totalVotes: 669,
      implemented: false,
      category: "Events",
    },
  ]

  const filteredActivePolls = activePolls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredClosedPolls = closedPolls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleVote = (pollId: number) => {
    if (!selectedOption) {
      toast({
        title: "No option selected",
        description: "Please select an option before voting.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Vote Recorded",
      description: "Your vote has been successfully recorded.",
    })
    setSelectedOption("")
    // In a real app, this would send the vote to the server
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Polling System</h2>
          <p className="text-muted-foreground">
            Participate in polls to share your opinion on campus matters. Polls that meet the threshold are
            automatically forwarded to relevant authorities.
          </p>
        </div>
        <Link href="/dashboard/polling/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Poll
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search polls..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Polls</TabsTrigger>
          <TabsTrigger value="closed">Closed Polls</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {filteredActivePolls.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredActivePolls.map((poll) => (
                <Card key={poll.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{poll.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Created by {poll.creator} • {poll.category}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Expires in {poll.expiresIn}
                        </span>
                        {poll.metThreshold && (
                          <Badge className="bg-green-100 text-green-800 border-0">Threshold Met</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{poll.description}</p>

                    <div className="mb-4">
                      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                        {poll.options.map((option) => (
                          <div key={option.id} className="flex items-start space-x-2 py-2">
                            <RadioGroupItem value={option.id} id={`option-${poll.id}-${option.id}`} />
                            <Label htmlFor={`option-${poll.id}-${option.id}`} className="flex-1">
                              {option.text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total Votes: {poll.totalVotes}</span>
                        <span>Threshold: {poll.threshold}</span>
                      </div>
                      <Progress
                        value={(poll.totalVotes / poll.threshold) * 100}
                        className={`h-2 ${poll.metThreshold ? "bg-green-500" : ""}`}
                      />
                    </div>

                    {poll.metThreshold && poll.forwardedTo && (
                      <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-xs text-green-800 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Forwarded to {poll.forwardedTo} for review
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" className="flex items-center" asChild>
                      <Link href={`/dashboard/polling/${poll.id}`}>
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" onClick={() => handleVote(poll.id)}>
                      Vote
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No polls found</h3>
              <p className="text-muted-foreground mt-1">No polls match your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="closed" className="space-y-4">
          {filteredClosedPolls.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClosedPolls.map((poll) => (
                <Card key={poll.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{poll.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Created by {poll.creator} • {poll.category} • Closed {poll.closedDate}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          poll.implemented
                            ? "bg-green-100 text-green-800 border-0"
                            : "bg-blue-100 text-blue-800 border-0"
                        }
                      >
                        {poll.implemented ? "Implemented" : "Pending Implementation"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{poll.description}</p>

                    <div className="space-y-4 mb-4">
                      <div className="p-2 bg-muted rounded-md">
                        <p className="text-sm font-medium">Result: {poll.result.winning}</p>
                        <p className="text-xs text-muted-foreground">
                          Won with {poll.result.percentage}% of votes ({poll.totalVotes} total votes)
                        </p>
                      </div>

                      <div className="space-y-3">
                        {poll.options.map((option) => (
                          <div key={option.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className={option.text === poll.result.winning ? "font-medium" : ""}>
                                {option.text}
                              </span>
                              <span>{option.percentage}%</span>
                            </div>
                            <Progress
                              value={option.percentage}
                              className={`h-2 ${option.text === poll.result.winning ? "bg-primary" : ""}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {!poll.implemented && (
                      <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-800 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending implementation by administration
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full flex items-center" asChild>
                      <Link href={`/dashboard/polling/${poll.id}`}>
                        View Full Results <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No closed polls found</h3>
              <p className="text-muted-foreground mt-1">No closed polls match your search criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

