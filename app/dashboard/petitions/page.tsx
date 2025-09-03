"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Search } from "lucide-react"
import { PetitionCard } from "./_components/petition-card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

type Petition = Database['public']['Tables']['petitions']['Row'] & {
  profiles: {
    first_name: string | null
    last_name: string | null
    student_id: string | null
  } | null
  signature_count?: number
}

export default function PetitionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    // Load data from database now that it has been seeded
    fetchPetitions()
  }, [])

  async function fetchPetitions() {
    try {
      setLoading(true)
      
      // First, try to get just the petitions without joins to debug
      const { data: petitionsData, error: petitionsError } = await supabase
        .from('petitions')
        .select('*')
        .order('created_at', { ascending: false })

      if (petitionsError) {
        console.error('Petitions query error:', petitionsError)
        throw petitionsError
      }

      console.log('Petitions data:', petitionsData)

      // If petitions fetch works, try to get profiles separately
      if (petitionsData && petitionsData.length > 0) {
        const userIds = petitionsData.map(p => p.user_id).filter(Boolean)
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, student_id')
          .in('user_id', userIds)

        if (profilesError) {
          console.error('Profiles query error:', profilesError)
        }

        console.log('Profiles data:', profilesData)

        // Get signature counts
        const petitionIds = petitionsData.map(p => p.id)
        const { data: signatureCounts, error: signaturesError } = await supabase
          .from('petition_signatures')
          .select('petition_id')
          .in('petition_id', petitionIds)

        if (signaturesError) {
          console.error('Signatures query error:', signaturesError)
        }

        console.log('Signature counts:', signatureCounts)

        // Count signatures per petition
        const signatureCountMap = signatureCounts?.reduce((acc, sig) => {
          acc[sig.petition_id] = (acc[sig.petition_id] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        // Create profiles map
        const profilesMap = profilesData?.reduce((acc, profile) => {
          acc[profile.user_id] = profile
          return acc
        }, {} as Record<string, any>) || {}

        // Combine data
        const petitionsWithCounts = petitionsData.map(petition => ({
          ...petition,
          signature_count: signatureCountMap[petition.id] || 0,
          profiles: petition.user_id ? profilesMap[petition.user_id] || null : null
        }))

        setPetitions(petitionsWithCounts)
      } else {
        setPetitions([])
      }
    } catch (error: any) {
      console.error('Error fetching petitions:', error)
      setError(error?.message || 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

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

