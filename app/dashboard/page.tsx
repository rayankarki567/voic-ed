import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle2, Clock, FileText, MessageSquare, PieChart, ThumbsUp, Vote } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, Mark! Here's what's happening in your student community.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Petitions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Surveys</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+1 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">+18 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Votes</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Student council elections</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="petitions">Your Petitions</TabsTrigger>
          <TabsTrigger value="surveys">Your Surveys</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Stay updated with the latest activities in your student community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <ThumbsUp className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Your petition received 10 new signatures</p>
                  <p className="text-sm text-muted-foreground">
                    "Extend Library Hours During Exam Period" now has 45 signatures.
                  </p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <MessageSquare className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">New replies to your forum post</p>
                  <p className="text-sm text-muted-foreground">"Ideas for Campus Sustainability" has 3 new replies.</p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Survey completed</p>
                  <p className="text-sm text-muted-foreground">
                    You completed "Campus Dining Options" survey. Thank you for your feedback.
                  </p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="petitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Petitions</CardTitle>
              <CardDescription>Petitions you've created or signed recently.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <FileText className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Extend Library Hours During Exam Period</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Created by you</span>
                  </div>
                  <p className="text-sm text-muted-foreground">45/100 signatures • 15 days remaining</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <FileText className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">More Vegetarian Options in Cafeteria</p>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Signed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">78/100 signatures • 5 days remaining</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Petitions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="surveys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Surveys</CardTitle>
              <CardDescription>Surveys you've participated in or created.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <PieChart className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Campus Dining Options</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">You completed this survey on May 15, 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <PieChart className="mt-1 h-5 w-5 text-primary" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Student Wellness Program Feedback</p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Expires in 3 days • 5 minutes to complete</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Surveys
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upcoming Votes</CardTitle>
            <CardDescription>Make your voice heard in these upcoming elections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Student Council Elections</h4>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In 5 days</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vote for your class representatives and student body president.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Campus Improvement Referendum</h4>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In 12 days</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vote on allocation of funds for campus improvement projects.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/voting" className="text-sm text-primary flex items-center">
              View all votes <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Active Forums</CardTitle>
            <CardDescription>Join these popular discussions in the student community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Ideas for Campus Sustainability</h4>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                <span>32 replies</span>
                <span className="mx-2">•</span>
                <span>Last activity 2 hours ago</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Course Registration Tips & Tricks</h4>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                <span>47 replies</span>
                <span className="mx-2">•</span>
                <span>Last activity 5 hours ago</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Mental Health Resources on Campus</h4>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                <span>18 replies</span>
                <span className="mx-2">•</span>
                <span>Last activity yesterday</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/forums" className="text-sm text-primary flex items-center">
              View all forums <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Status of complaints submitted to administration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Broken Water Fountain in Science Building</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Resolved</span>
              </div>
              <p className="text-xs text-muted-foreground">Submitted on May 10, 2025 • Resolved on May 12, 2025</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Wi-Fi Issues in Dormitory B</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Submitted on May 14, 2025 • IT department is investigating
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/complaints" className="text-sm text-primary flex items-center">
              Submit a complaint <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

