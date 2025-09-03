"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, AlertTriangle, Clock } from "lucide-react"
import type { Database } from '@/types/database.types'

type Petition = Database['public']['Tables']['petitions']['Row'] & {
  profiles: {
    first_name: string | null
    last_name: string | null
    student_id: string | null
  } | null
  signature_count?: number
}

interface PetitionCardProps {
  petition: Petition
}

export function PetitionCard({ petition }: PetitionCardProps) {
  const [signed, setSigned] = useState(false)

  const handleSign = () => {
    setSigned(true)
    // In a real app, this would send an API request
  }

  const signatureCount = petition.signature_count || 0
  const goal = petition.target_signatures || 0
  const progressPercentage = Math.min(goal > 0 ? (signatureCount / goal) * 100 : 0, 100)
  
  // Calculate days remaining - for now we'll use 30 days from creation as default
  const createdDate = new Date(petition.created_at)
  const endDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days default
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))

  // Create full name from first_name and last_name
  const authorName = petition.profiles 
    ? `${petition.profiles.first_name || ''} ${petition.profiles.last_name || ''}`.trim() || 'Unknown'
    : 'Unknown'

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{petition.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              Created by {authorName} • Student ID: {petition.profiles?.student_id || 'Unknown'}
              {` • Created on ${new Date(petition.created_at).toLocaleDateString()}`}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {petition.status && (
              <Badge
                variant="outline"
                className={`border-0 ${
                  petition.status === "active"
                    ? "bg-green-100 text-green-800"
                    : petition.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : petition.status === "expired"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {petition.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{petition.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{signatureCount} signatures</span>
            <span>Goal: {goal}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{daysRemaining} days remaining</span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Updated: {new Date(petition.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/petitions/${petition.id}`}>
            <FileText className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
        {!signed && (
          <Button size="sm" onClick={handleSign}>
            Sign Petition
          </Button>
        )}
        {signed && (
          <Button size="sm" variant="outline" disabled>
            Signed
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}