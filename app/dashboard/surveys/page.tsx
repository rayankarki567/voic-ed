"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, PieChart, Plus, Search } from "lucide-react"

export default function SurveysPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const activeSurveys = [
    {
      id: 1,
      title: "Student Wellness Program Feedback",
      description: "Help us improve the campus wellness programs by sharing your experiences and suggestions.",
      creator: "Student Health Services",
      expiresIn: "3 days",
      estimatedTime: "5 minutes",
      responses: 87,
      category: "Health & Wellness",
    },
    {
      id: 2,
      title: "Academic Advising Satisfaction",
      description: "Share your feedback on the academic advising services to help us better support students.",
      creator: "Office of Academic Affairs",
      expiresIn: "7 days",
      estimatedTime: "8 minutes",
      responses: 124,
      category: "Academic",
    },
    {
      id: 3,
      title: "Campus Dining Preferences",
      description: "Help shape the future of dining options on campus by sharing your preferences and suggestions.",
      creator: "Dining Services",
      expiresIn: "5 days",
      estimatedTime: "6 minutes",
      responses: 215,
      category: "Campus Life",
    },
    {
      id: 4,
      title: "Library Resource Utilization",
      description: "Tell us about your usage of library resources to help us improve our services.",
      creator: "University Library",
      expiresIn: "10 days",
      estimatedTime: "4 minutes",
      responses: 68,
      category: "Academic",
    },
  ]

  const completedSurveys = [
    {
      id: 5,
      title: "Campus Dining Options",
      description: "Thank you for providing feedback on campus dining options.",
      completedDate: "May 15, 2025",
      category: "Campus Life",
    },
  ]

  const filteredActiveSurveys = activeSurveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTakeSurvey = (id: number) => {
    router.push(`/dashboard/surveys/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Surveys</h2>
          <p className="text-muted-foreground">Participate in surveys to help improve campus services and programs.</p>
        </div>
        <Link href="/dashboard/surveys/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Survey
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search surveys..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Surveys</TabsTrigger>
          <TabsTrigger value="completed">Completed Surveys</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {filteredActiveSurveys.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredActiveSurveys.map((survey) => (
                <Card key={survey.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Created by {survey.creator} • {survey.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{survey.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Expires in {survey.expiresIn}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{survey.estimatedTime} to complete</span>
                      </div>
                      <div className="flex items-center">
                        <PieChart className="mr-1 h-3 w-3" />
                        <span>{survey.responses} responses so far</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleTakeSurvey(survey.id)}>
                      Take Survey
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No surveys found</h3>
              <p className="text-muted-foreground mt-1">No surveys match your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {completedSurveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{survey.category}</CardDescription>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{survey.description}</p>
                  <p className="text-xs text-muted-foreground">Completed on {survey.completedDate}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Responses
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

