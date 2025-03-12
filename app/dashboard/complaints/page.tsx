"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Clock, FileText, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function ComplaintsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    priority: "medium",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate complaint submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully and assigned to the relevant department.",
      })
      setFormData({
        title: "",
        department: "",
        location: "",
        description: "",
        priority: "medium",
      })
    }, 1500)
  }

  const complaints = [
    {
      id: 1,
      title: "Broken Water Fountain in Science Building",
      description: "The water fountain on the 2nd floor of the Science Building has been broken for over a week.",
      department: "Facilities Management",
      status: "Resolved",
      submittedDate: "May 10, 2025",
      resolvedDate: "May 12, 2025",
      reference: "CM-2025-001",
      assignedTo: "Maintenance Team",
      priority: "Medium",
      resolution: "Water fountain was repaired and tested. Working properly now.",
    },
    {
      id: 2,
      title: "Wi-Fi Issues in Dormitory B",
      description:
        "The Wi-Fi connection in Dormitory B is extremely slow and frequently disconnects, affecting students' ability to complete online assignments.",
      department: "IT Services",
      status: "In Progress",
      submittedDate: "May 14, 2025",
      resolvedDate: null,
      reference: "CM-2025-002",
      assignedTo: "Network Support Team",
      priority: "High",
      updates: [
        {
          date: "May 15, 2025",
          note: "Initial assessment completed. Found interference issues from nearby equipment.",
        },
        { date: "May 16, 2025", note: "Ordered new access points to improve coverage." },
      ],
    },
    {
      id: 3,
      title: "Inadequate Lighting in Parking Lot C",
      description:
        "Several lights in Parking Lot C are not functioning, creating safety concerns for students and staff during evening hours.",
      department: "Campus Security",
      status: "Pending",
      submittedDate: "May 16, 2025",
      resolvedDate: null,
      reference: "CM-2025-003",
      assignedTo: "Pending Assignment",
      priority: "High",
      escalationEligible: true,
      escalationDate: "May 23, 2025",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Complaints</h2>
        <p className="text-muted-foreground">
          Submit and track complaints to help improve campus facilities and services.
        </p>
      </div>

      <Tabs defaultValue="submit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submit">Submit a Complaint</TabsTrigger>
          <TabsTrigger value="history">Complaint History</TabsTrigger>
        </TabsList>
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Submit a New Complaint</CardTitle>
                <CardDescription>
                  Provide detailed information to help us address your concern effectively.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    required
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic Affairs</SelectItem>
                      <SelectItem value="facilities">Facilities Management</SelectItem>
                      <SelectItem value="it">IT Services</SelectItem>
                      <SelectItem value="security">Campus Security</SelectItem>
                      <SelectItem value="housing">Housing & Residence Life</SelectItem>
                      <SelectItem value="dining">Dining Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where is the issue located?"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide a detailed description of the issue"
                    className="min-h-[150px]"
                    required
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                      <SelectItem value="medium">Medium - Affects daily activities</SelectItem>
                      <SelectItem value="high">High - Urgent attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border border-blue-200 bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>
                      Automatic Escalation System: Complaints not assigned within 3 days or not addressed within 7 days
                      are automatically escalated to higher authorities.
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">Images or documents (MAX. 5MB)</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Reference: {complaint.reference} • {complaint.department} • Priority: {complaint.priority}
                      </CardDescription>
                    </div>
                    <div>
                      {complaint.status === "Resolved" && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-0 flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
                        </Badge>
                      )}
                      {complaint.status === "In Progress" && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> In Progress
                        </Badge>
                      )}
                      {complaint.status === "Pending" && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-0 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs font-medium mb-1">Submission Details:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Submitted:</span> {complaint.submittedDate}
                        </div>
                        {complaint.resolvedDate && (
                          <div>
                            <span className="font-medium">Resolved:</span> {complaint.resolvedDate}
                          </div>
                        )}
                        {complaint.escalationEligible && (
                          <div className="text-amber-800">
                            <span className="font-medium">Auto-escalation if not addressed by:</span>{" "}
                            {complaint.escalationDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs font-medium mb-1">Assignment Details:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span className="font-medium">Assigned to:</span> {complaint.assignedTo}
                        </div>
                        {complaint.resolution && (
                          <div>
                            <span className="font-medium">Resolution:</span> {complaint.resolution}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {complaint.updates && complaint.updates.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs font-medium mb-2">Updates:</p>
                      <div className="space-y-2">
                        {complaint.updates.map((update, index) => (
                          <div key={index} className="bg-blue-50 p-2 rounded-md text-xs">
                            <p className="font-medium text-blue-800">{update.date}</p>
                            <p className="text-muted-foreground">{update.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
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

