"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Search } from "lucide-react"
import { PetitionCard } from "./_components/petition-card"

export default function PetitionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const activePetitions = [
    {
      id: 1,
      title: "Extend Library Hours During Exam Period",
      description:
        "We request the university to extend library hours to 24/7 during the final exam period to accommodate students' study needs.",
      creator: "Mark Smith",
      isCreatedByUser: true,
      signatures: 45,
      goal: 100,
      daysRemaining: 15,
      category: "Academic",
      createdAt: "May 5, 2025",
      status: "Under Review",
      lastUpdated: "May 10, 2025",
    },
    {
      id: 2,
      title: "More Vegetarian Options in Cafeteria",
      description:
        "We need more diverse vegetarian and vegan options in the campus cafeteria to accommodate dietary preferences.",
      creator: "Jane Doe",
      isCreatedByUser: false,
      signatures: 78,
      goal: 100,
      daysRemaining: 5,
      category: "Campus Life",
      createdAt: "May 1, 2025",
      escalated: true,
      escalationReason: "No faculty response after 7 days",
      lastUpdated: "May 8, 2025",
    },
    {
      id: 3,
      title: "Improve Campus Wi-Fi Coverage",
      description:
        "Many areas on campus have poor Wi-Fi coverage. We petition for improved infrastructure to support student learning.",
      creator: "Alex Johnson",
      isCreatedByUser: false,
      signatures: 120,
      goal: 150,
      daysRemaining: 10,
      category: "Infrastructure",
      createdAt: "April 28, 2025",
      lastUpdated: "May 9, 2025",
    },
    {
      id: 4,
      title: "Add More Bike Racks on Campus",
      description:
        "With the increasing number of students using bikes, we need more secure bike racks around campus buildings.",
      creator: "Sam Wilson",
      isCreatedByUser: false,
      signatures: 65,
      goal: 100,
      daysRemaining: 20,
      category: "Infrastructure",
      createdAt: "May 3, 2025",
      lastUpdated: "May 11, 2025",
    },
  ]

  const successfulPetitions = [
    {
      id: 5,
      title: "Install Water Bottle Refill Stations",
      description:
        "Successfully petitioned for water bottle refill stations to be installed across campus to reduce plastic waste.",
      creator: "Environmental Club",
      signatures: 230,
      goal: 200,
      category: "Sustainability",
      status: "Approved",
      createdAt: "March 15, 2025",
      lastUpdated: "April 30, 2025",
    },
    {
      id: 6,
      title: "Extended Gym Hours on Weekends",
      description: "The campus gym will now be open until 10 PM on weekends based on student feedback.",
      creator: "Student Athletics Association",
      signatures: 185,
      goal: 150,
      category: "Campus Life",
      status: "Approved",
      createdAt: "April 1, 2025",
      lastUpdated: "April 20, 2025",
    },
  ]

  const filteredActivePetitions = activePetitions.filter(
    (petition) =>
      petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      petition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      petition.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSuccessfulPetitions = successfulPetitions.filter(
    (petition) =>
      petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      petition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      petition.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          {filteredActivePetitions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredActivePetitions.map((petition) => (
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
          {filteredSuccessfulPetitions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSuccessfulPetitions.map((petition) => (
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
            {activePetitions
              .filter((petition) => petition.isCreatedByUser)
              .map((petition) => (
                <PetitionCard key={petition.id} petition={petition} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

