"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, AlertTriangle, Clock } from "lucide-react"

interface PetitionCardProps {
  petition: {
    id: number
    title: string
    description: string
    creator: string
    isCreatedByUser?: boolean
    signatures: number
    goal: number
    daysRemaining: number
    category: string
    status?: string
    escalated?: boolean
    escalationReason?: string
    createdAt?: string
    lastUpdated?: string
  }
}

export function PetitionCard({ petition }: PetitionCardProps) {
  const [signed, setSigned] = useState(false)

  const handleSign = () => {
    setSigned(true)
    // In a real app, this would send an API request
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{petition.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              Created by {petition.creator} • {petition.category}
              {petition.createdAt && ` • Created on ${petition.createdAt}`}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {petition.isCreatedByUser && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                Created by you
              </Badge>
            )}
            {petition.escalated && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-0 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Escalated
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This petition was automatically escalated to higher authorities due to lack of response.</p>
                    {petition.escalationReason && <p>Reason: {petition.escalationReason}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {petition.status && (
              <Badge
                variant="outline"
                className={`border-0 ${
                  petition.status === "Under Review"
                    ? "bg-blue-100 text-blue-800"
                    : petition.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : petition.status === "Denied"
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
            <span>{petition.signatures} signatures</span>
            <span>Goal: {petition.goal}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${(petition.signatures / petition.goal) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{petition.daysRemaining} days remaining</span>
            {petition.lastUpdated && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Last updated: {petition.lastUpdated}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/petitions/${petition.id}`}>
            <FileText className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
        {!petition.isCreatedByUser && !signed && (
          <Button size="sm" onClick={handleSign}>
            Sign Petition
          </Button>
        )}
        {!petition.isCreatedByUser && signed && (
          <Button size="sm" variant="outline" disabled>
            Signed
          </Button>
        )}
        {petition.isCreatedByUser && (
          <Button size="sm" variant="secondary" asChild>
            <Link href={`/dashboard/petitions/edit/${petition.id}`}>Edit</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

