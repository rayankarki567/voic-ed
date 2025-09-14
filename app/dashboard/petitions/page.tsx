"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Search } from "lucide-react"
import { PetitionCard } from "./_components/petition-card"

// Use the same petition structure as the details page
type PetitionData = {
  id: number
  title: string
  description: string
  creator: string
  creatorRole: string
  signatures: number
  goal: number
  daysRemaining: number
  category: string
  createdAt: string
  status: string
  lastUpdated: string
}

type Petition = {
  id: string
  title: string
  description: string
  user_id: string
  category: string
  target_signatures: number
  current_signatures: number
  status: string
  created_at: string
  updated_at: string
  expires_at: string | null
  escalated_at: string | null
  escalated_to: string | null
  signature_count?: number
  profiles: {
    first_name: string | null
    last_name: string | null
    student_id: string | null
  } | null
}

export default function PetitionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get petition data by ID (same logic as details page)
  const getPetitionData = (id: number): PetitionData => {
    const baseData = {
      id,
      title: "Extend Library Hours During Exam Period",
      description: "We request the university to extend library hours to 24/7 during the final exam period to accommodate students' study needs.",
      creator: "Mark Smith",
      creatorRole: "Student",
      signatures: 45,
      goal: 100,
      daysRemaining: 15,
      category: "Academic",
      createdAt: "May 5, 2025",
      status: "Under Review",
      lastUpdated: "May 10, 2025",
    }

    // Customize data based on ID
    switch (id) {
      case 1:
        return {
          ...baseData,
          id: 1,
          title: "Reduce Class Time from 12:40 to 11:00 AM",
          description: "We request the university to reduce daily class duration from the current 12:40 PM to 11:00 AM or even 9:00 AM if possible to allow students more time for self-study and personal activities.",
          creator: "Mark Smith",
          signatures: 78,
          goal: 150,
          category: "Academic",
          status: "active"
        }
      case 2:
        return {
          ...baseData,
          id: 2,
          title: "Allow Full Usage of Laptops and Phones in Classrooms",
          description: "Request to allow students to use laptops and mobile devices freely in classrooms for note-taking, research, and educational purposes during lectures.",
          creator: "Sarah Johnson",
          signatures: 92,
          goal: 120,
          category: "Academic",
          status: "active"
        }
      case 3:
        return {
          ...baseData,
          id: 3,
          title: "Change Canteen Contractor and Add New Food Options",
          description: "Request to change the current canteen contractor and introduce diverse, affordable food options with better quality and easier ordering system for students.",
          creator: "Alex Chen",
          signatures: 156,
          goal: 200,
          category: "Facilities",
          status: "active"
        }
      case 4:
        return {
          ...baseData,
          id: 4,
          title: "More Power Outlets in Classroom Areas",
          description: "Request to install additional power outlets in classroom areas to accommodate students' electronic devices like laptops and tablets during lectures.",
          creator: "Emily Davis",
          signatures: 87,
          goal: 100,
          category: "Facilities",
          status: "completed"
        }
      case 5:
        return {
          ...baseData,
          id: 5,
          title: "Convert All Rooms to Full Digital Classroom like in 318",
          description: "Request to convert all classrooms into fully digital classrooms with smart boards, high-speed internet, and digital learning tools for modern education delivery.",
          creator: "Michael Wilson",
          signatures: 64,
          goal: 80,
          category: "Technology",
          status: "active"
        }
      case 6:
        return {
          ...baseData,
          id: 6,
          title: "Improve Campus WiFi Speed and Coverage",
          description: "Request to upgrade the campus WiFi infrastructure to provide faster internet speeds and better coverage across all academic buildings and dormitories.",
          creator: "Lisa Zhang",
          signatures: 134,
          goal: 150,
          category: "Technology",
          status: "active"
        }
      default:
        return { ...baseData, id }
    }
  }

  // Convert petition data to the format expected by PetitionCard
  const convertToPetition = (data: PetitionData): Petition => ({
    id: data.id.toString(),
    title: data.title,
    description: data.description,
    user_id: `user${data.id}`,
    category: data.category,
    target_signatures: data.goal,
    current_signatures: data.signatures,
    status: data.status === "completed" ? "completed" : "active",
    created_at: new Date(data.createdAt).toISOString(),
    updated_at: new Date(data.lastUpdated).toISOString(),
    expires_at: null,
    escalated_at: null,
    escalated_to: null,
    signature_count: data.signatures,
    profiles: {
      first_name: data.creator.split(' ')[0],
      last_name: data.creator.split(' ')[1] || '',
      student_id: `STU00${data.id}`
    }
  })

  useEffect(() => {
    // Generate petitions from the same data source as details page
    const timer = setTimeout(() => {
      const petitionData = [1, 2, 3, 4, 5, 6].map(id => {
        const data = getPetitionData(id)
        return convertToPetition(data)
      })
      
      setPetitions(petitionData)
      setLoading(false)
    }, 500) // Quick 0.5 second loading

    return () => clearTimeout(timer)
  }, [])

  const filteredPetitions = petitions.filter(petition =>
    petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    petition.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activePetitions = filteredPetitions.filter(p => p.status === 'active')
  const successfulPetitions = filteredPetitions.filter(p => p.status === 'completed')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading petitions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p>Error loading petitions: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Petitions</h2>
          <p className="text-muted-foreground">
            Create or sign petitions to make a difference in your campus community.
          </p>
        </div>
        <Link href="/dashboard/petitions/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Petition
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search petitions..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Petitions</TabsTrigger>
          <TabsTrigger value="successful">Successful Petitions</TabsTrigger>
          <TabsTrigger value="your">Your Petitions</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activePetitions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activePetitions.map((petition) => (
                <PetitionCard key={petition.id} petition={petition} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No petitions found</h3>
              <p className="text-muted-foreground mt-1">No petitions match your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="successful" className="space-y-4">
          {successfulPetitions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {successfulPetitions.map((petition) => (
                <PetitionCard key={petition.id} petition={petition} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No successful petitions found</h3>
              <p className="text-muted-foreground mt-1">No successful petitions match your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="your" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {petitions
              .filter((petition) => petition.user_id === petition.user_id) // TODO: Compare with current user ID
              .map((petition) => (
                <PetitionCard key={petition.id} petition={petition} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

