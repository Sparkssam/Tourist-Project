"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Tour {
  id: string
  title: string
  minDays: number
  maxDays: number
  basePricePerPerson: number
}

interface TourBookingFormProps {
  tour: Tour
}

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export function TourBookingForm({ tour }: TourBookingFormProps) {
  const router = useRouter()
  const [startDate, setStartDate] = useState("")
  const [numberOfDays, setNumberOfDays] = useState(tour.minDays)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [endDate, setEndDate] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)

  // Calculate end date when start date or number of days changes
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate)
      const end = new Date(start)
      end.setDate(start.getDate() + numberOfDays - 1)
      setEndDate(end.toISOString().split("T")[0])
    }
  }, [startDate, numberOfDays])

  // Calculate total price when any relevant field changes
  useEffect(() => {
    const total = (adults + children) * tour.basePricePerPerson * numberOfDays
    setTotalPrice(total)
  }, [adults, children, numberOfDays, tour.basePricePerPerson])

  const handleSendInquiry = () => {
    const inquiryData = {
      tourId: tour.id,
      tourTitle: tour.title,
      startDate,
      endDate,
      numberOfDays,
      adults,
      children,
      totalPrice,
    }

    // Navigate to inquiry page with pre-populated data
    const queryParams = new URLSearchParams({
      data: JSON.stringify(inquiryData),
    }).toString()

    router.push(`/inquiry?${queryParams}`)
  }

  // Generate array of day options
  const dayOptions = []
  for (let i = tour.minDays; i <= tour.maxDays; i++) {
    dayOptions.push(i)
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Card className="mt-4 bg-muted/30">
      <CardContent className="p-4 space-y-4">
        <h4 className="font-semibold text-sm text-foreground mb-3">Book This Tour</h4>

        {/* Starting Date */}
        <div className="space-y-2">
          <Label htmlFor={`start-date-${tour.id}`} className="text-xs font-medium flex items-center gap-1">
            <CalendarIcon />
            Starting Date
          </Label>
          <Input
            id={`start-date-${tour.id}`}
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Number of Days */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Number of Days</Label>
          <Select value={numberOfDays.toString()} onValueChange={(value) => setNumberOfDays(Number.parseInt(value))}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days} {days === 1 ? "Day" : "Days"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Date Display */}
        {endDate && (
          <div className="text-xs text-muted-foreground">
            <strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}
          </div>
        )}

        {/* Number of People */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor={`adults-${tour.id}`} className="text-xs font-medium flex items-center gap-1">
              <UsersIcon />
              Adults
            </Label>
            <Input
              id={`adults-${tour.id}`}
              type="number"
              min="1"
              max="20"
              value={adults}
              onChange={(e) => setAdults(Number.parseInt(e.target.value) || 1)}
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`children-${tour.id}`} className="text-xs font-medium">
              Children
            </Label>
            <Input
              id={`children-${tour.id}`}
              type="number"
              min="0"
              max="20"
              value={children}
              onChange={(e) => setChildren(Number.parseInt(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Total Price Display */}
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-sm font-semibold text-primary">Total Price: ${totalPrice.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {adults + children} people × {numberOfDays} days × ${tour.basePricePerPerson}/person/day
          </div>
        </div>

        {/* Send Inquiry Button */}
        <Button onClick={handleSendInquiry} className="w-full text-sm" disabled={!startDate}>
          Send Enquiry
        </Button>
      </CardContent>
    </Card>
  )
}
