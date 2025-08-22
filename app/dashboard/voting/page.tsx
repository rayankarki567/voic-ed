"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Clock, Shield, Vote } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function VotingPage() {
  const { toast } = useToast()
  const [hasVoted, setHasVoted] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)

  const activeElections = [
    {
      id: 1,
      title: "Student Council Elections",
      description: "Vote for your class representatives and student body president for the 2025-2026 academic year.",
      startDate: "May 20, 2025",
      endDate: "May 25, 2025",
      daysRemaining: 5,
      positions: [
        {
          title: "Student Body President",
          candidates: [
            {
              id: 1,
              name: "Supreme Khadka",
              avatar: "SK",
              votes: 545,
              platform: "Improving campus facilities and student services",
            },
            {
              id: 2,
              name: "Srijal Sayami",
              avatar: "SS",
              votes: 432,
              platform: "Enhancing academic resources and mental health support",
            },
            {
              id: 3,
              name: "Rayan Karki",
              avatar: "RK",
              votes: 588,
              platform: "Promoting diversity and inclusion initiatives",
            },
          ],
        },
        {
          title: "Class Representative",
          candidates: [
            {
              id: 4,
              name: "Parikshit Maharjan",
              avatar: "PM",
              votes: 19,
              platform: "Better class scheduling and course selection",
            },
            {
              id: 5,
              name: "Piyush KC",
              avatar: "PK",
              votes: 16,
              platform: "Improving classroom technology and resources",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Campus Improvement Referendum",
      description: "Vote on allocation of funds for campus improvement projects.",
      startDate: "May 27, 2025",
      endDate: "June 3, 2025",
      daysRemaining: 12,
      options: [
        {
          id: 1,
          title: "Renovate Student Center",
          votes: 210,
          description: "Modernize facilities and create more study spaces",
        },
        {
          id: 2,
          title: "Upgrade ECA Facilities",
          votes: 185,
          description: "Improve gym equipment and sports fields",
        },
        {
          id: 3,
          title: "Enhance Campus Wi-Fi",
          votes: 245,
          description: "Expand coverage and improve connection speeds",
        },
      ],
    },
  ]

  const pastElections = [
    {
      id: 3,
      title: "Reduce Regular Class Hours",
      description: "Vote on reducing the class hour from 12:40 to 11:00.",
      startDate: "April 10, 2025",
      endDate: "April 15, 2025",
      result: "Approved",
      turnout: "98% of eligible voters",
      options: [
        { id: 1, title: "Reduce to 9:00", votes: 320, percentage: 70 },
        { id: 2, title: "Reduce to 11:00", votes: 12, percentage: 24 },
        { id: 3, title: "Keep current hours", votes: 5, percentage: 6 },
      ],
    },
    {
      id: 4,
      title: "CR Selection for Computer Science Department",
      description: "Selection of Class Representatives for the Computer Science Department",
      startDate: "March 15, 2025",
      endDate: "March 20, 2025",
      result: "Completed",
      turnout: "84% of eligible voters",
      positions: [
        {
          title: "CS Department CR",
          candidates: [
            { id: 6, name: "Parikshit Maharjan", avatar: "PM", votes: 187, percentage: 52, elected: true },
            { id: 7, name: "Swornim Dangol", avatar: "SD", votes: 108, percentage: 30 },
            { id: 8, name: "Ram Bahadur", avatar: "OH", votes: 65, percentage: 18 },
          ],
        },
      ],
    },
  ]

  const handleVote = (electionId: number, candidateId: number) => {
    if (isAnonymous) {
      toast({
        title: "Anonymous Vote Recorded",
        description: "Your vote has been recorded anonymously. Your identity is protected.",
        duration: 5000,
      })
    } else {
      toast({
        title: "Vote Recorded",
        description: "Your vote has been recorded successfully.",
        duration: 5000,
      })
    }
    setHasVoted(true)
    // In a real app, this would send the vote to the server with appropriate anonymization if selected
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Voting</h2>
        <p className="text-muted-foreground">
          Participate in student elections and referendums to shape your campus community.
        </p>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-muted rounded-lg border border-border mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Secure and Transparent Voting System</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Our voting system ensures that all votes are secure and counted accurately. You can choose to vote anonymously
          for added privacy.
        </p>

        <div className="flex items-center space-x-2 mt-2">
          <Switch id="anonymous-mode" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          <Label htmlFor="anonymous-mode" className="font-medium">
            Anonymous Voting Mode {isAnonymous ? "Enabled" : "Disabled"}
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          {isAnonymous
            ? "Your vote will be recorded without any connection to your identity."
            : "Your name will be recorded along with your vote for verification purposes."}
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="past">Past Elections</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-6">
          {activeElections.map((election) => (
            <Card key={election.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{election.title}</CardTitle>
                    <CardDescription className="mt-1">{election.description}</CardDescription>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {election.daysRemaining} days remaining
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Voting Period:</span> {election.startDate} to {election.endDate}
                </div>

                {election.positions && (
                  <div className="space-y-6">
                    {election.positions.map((position) => (
                      <div key={position.title} className="space-y-4">
                        <h4 className="font-medium">{position.title}</h4>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {position.candidates.map((candidate) => (
                            <Card key={candidate.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={candidate.name} />
                                    <AvatarFallback>{candidate.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-base">{candidate.name}</CardTitle>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-3">
                                <p className="text-sm text-muted-foreground">{candidate.platform}</p>
                              </CardContent>
                              <CardFooter className="border-t pt-3">
                                <Button
                                  className="w-full"
                                  onClick={() => handleVote(election.id, candidate.id)}
                                  disabled={hasVoted}
                                >
                                  {hasVoted ? "Vote Recorded" : "Vote"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {election.options && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Options</h4>
                    <div className="space-y-4">
                      {election.options.map((option) => (
                        <Card key={option.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{option.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                          </CardContent>
                          <CardFooter className="border-t pt-3">
                            <Button
                              className="w-full"
                              onClick={() => handleVote(election.id, option.id)}
                              disabled={hasVoted}
                            >
                              {hasVoted ? "Vote Recorded" : "Vote"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline">View Details</Button>
                <Button variant="secondary">
                  <Vote className="mr-2 h-4 w-4" /> View Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="past" className="space-y-6">
          {pastElections.map((election) => (
            <Card key={election.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{election.title}</CardTitle>
                    <CardDescription className="mt-1">{election.description}</CardDescription>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-6">
                  <div>
                    <span className="font-medium">Voting Period:</span> {election.startDate} to {election.endDate}
                  </div>
                  <div>
                    <span className="font-medium">Result:</span> {election.result}
                  </div>
                  <div>
                    <span className="font-medium">Turnout:</span> {election.turnout}
                  </div>
                </div>

                {election.options && (
                  <div className="space-y-6">
                    <h4 className="font-medium">Results</h4>
                    <div className="space-y-6">
                      {election.options.map((option) => (
                        <div key={option.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.title}</span>
                            <span className="text-sm">
                              {option.votes} votes ({option.percentage}%)
                            </span>
                          </div>
                          <Progress value={option.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {election.positions && (
                  <div className="space-y-6">
                    <h4 className="font-medium">Results</h4>
                    {election.positions.map((position) => (
                      <div key={position.title} className="space-y-4">
                        <h5 className="text-sm font-medium">{position.title}</h5>
                        <div className="space-y-4">
                          {position.candidates.map((candidate) => (
                            <div key={candidate.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={candidate.name} />
                                    <AvatarFallback>{candidate.avatar}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{candidate.name}</span>
                                  {candidate.elected && (
                                    <Badge className="ml-2 bg-green-100 text-green-800 border-0">Elected</Badge>
                                  )}
                                </div>
                                <span className="text-sm">
                                  {candidate.votes} votes ({candidate.percentage}%)
                                </span>
                              </div>
                              <Progress
                                value={candidate.percentage}
                                className={`h-2 ${candidate.elected ? "bg-green-100" : "bg-muted"}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline">View Details</Button>
                <Button variant="secondary">
                  <Vote className="mr-2 h-4 w-4" /> Full Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

