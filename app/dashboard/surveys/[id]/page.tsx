"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, PieChart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SurveyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real app, this would come from an API call using the ID
  const surveyId = Number(params.id)

  const survey = {
    id: surveyId,
    title: "Student Wellness Program Feedback",
    description: "Help us improve the campus wellness programs by sharing your experiences and suggestions.",
    creator: "Student Health Services",
    expiresIn: "3 days",
    estimatedTime: "5 minutes",
    responses: 87,
    category: "Health & Wellness",
    questions: [
      {
        id: "q1",
        type: "radio",
        question: "How often do you use campus wellness services?",
        options: [
          { id: "q1-a", text: "Never" },
          { id: "q1-b", text: "Rarely (1-2 times per semester)" },
          { id: "q1-c", text: "Occasionally (monthly)" },
          { id: "q1-d", text: "Frequently (weekly)" },
          { id: "q1-e", text: "Very frequently (multiple times per week)" },
        ],
        required: true,
      },
      {
        id: "q2",
        type: "checkbox",
        question: "Which wellness services have you used? (Select all that apply)",
        options: [
          { id: "q2-a", text: "Counseling services" },
          { id: "q2-b", text: "Fitness center" },
          { id: "q2-c", text: "Nutrition counseling" },
          { id: "q2-d", text: "Stress management workshops" },
          { id: "q2-e", text: "Meditation sessions" },
          { id: "q2-f", text: "None of the above" },
        ],
        required: true,
      },
      {
        id: "q3",
        type: "radio",
        question: "How would you rate the quality of wellness services on campus?",
        options: [
          { id: "q3-a", text: "Poor" },
          { id: "q3-b", text: "Fair" },
          { id: "q3-c", text: "Good" },
          { id: "q3-d", text: "Very good" },
          { id: "q3-e", text: "Excellent" },
        ],
        required: true,
      },
      {
        id: "q4",
        type: "radio",
        question: "How easy is it to access wellness services when you need them?",
        options: [
          { id: "q4-a", text: "Very difficult" },
          { id: "q4-b", text: "Somewhat difficult" },
          { id: "q4-c", text: "Neutral" },
          { id: "q4-d", text: "Somewhat easy" },
          { id: "q4-e", text: "Very easy" },
        ],
        required: true,
      },
      {
        id: "q5",
        type: "text",
        question: "What suggestions do you have for improving wellness services on campus?",
        required: false,
      },
    ],
  }

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleCheckboxChange = (questionId: string, optionId: string, checked: boolean) => {
    const currentSelections = answers[questionId] || []
    let newSelections

    if (checked) {
      newSelections = [...currentSelections, optionId]
    } else {
      newSelections = currentSelections.filter((id: string) => id !== optionId)
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: newSelections,
    }))
  }

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isQuestionAnswered = (questionId: string) => {
    const question = survey.questions.find((q) => q.id === questionId)

    if (!question || !question.required) return true

    if (question.type === "radio") {
      return !!answers[questionId]
    } else if (question.type === "checkbox") {
      return answers[questionId]?.length > 0
    } else if (question.type === "text") {
      return !!answers[questionId]?.trim()
    }

    return false
  }

  const canProceed = () => {
    const currentQuestion = survey.questions[currentStep]
    return isQuestionAnswered(currentQuestion.id)
  }

  const handleNext = () => {
    if (currentStep < survey.questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Survey Completed",
        description: "Thank you for your feedback! Your responses have been recorded.",
      })
      router.push("/dashboard/surveys")
    }, 1500)
  }

  const currentQuestion = survey.questions[currentStep]
  const progress = ((currentStep + 1) / survey.questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/surveys")}>
          <ArrowLeft className="h-4 w-4" /> Back to Surveys
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">{survey.title}</h2>
        <p className="text-muted-foreground">{survey.description}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Expires in {survey.expiresIn}</span>
        </div>
        <div className="flex items-center gap-1">
          <PieChart className="h-4 w-4" />
          <span>{survey.responses} responses so far</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Question {currentStep + 1} of {survey.questions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </CardTitle>
          {currentQuestion.type === "checkbox" && <CardDescription>Select all that apply</CardDescription>}
        </CardHeader>
        <CardContent>
          {currentQuestion.type === "radio" && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleRadioChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "checkbox" && currentQuestion.options && (
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={(answers[currentQuestion.id] || []).includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(currentQuestion.id, option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.id}>{option.text}</Label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === "text" && (
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[150px]"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentStep < survey.questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Submit Survey
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

