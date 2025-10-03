"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function InquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    travelDates: "",
    adults: "1",
    children: "0",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Save to Supabase inquiries table
      const { error } = await supabase
        .from('inquiries')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          adults: parseInt(formData.adults) || 1,
          children: parseInt(formData.children) || 0,
          travel_dates: formData.travelDates || null,
          status: 'new'
        })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        travelDates: "",
        adults: "1",
        children: "0",
      })

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      setSubmitStatus("error")
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-luxury text-primary">Send Your Safari Inquiry</CardTitle>
            <p className="text-muted-foreground mt-2">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="travelDates" className="block text-sm font-medium text-foreground mb-2">
                    Preferred Travel Dates
                  </label>
                  <Input
                    id="travelDates"
                    name="travelDates"
                    type="date"
                    value={formData.travelDates}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-foreground mb-2">
                    Number of Adults *
                  </label>
                  <Input
                    id="adults"
                    name="adults"
                    type="number"
                    min="1"
                    required
                    value={formData.adults}
                    onChange={handleChange}
                    placeholder="Number of adults"
                  />
                </div>
                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-foreground mb-2">
                    Number of Children
                  </label>
                  <Input
                    id="children"
                    name="children"
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={handleChange}
                    placeholder="Number of children"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Safari inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your dream safari experience, preferred destinations, activities, accommodation preferences, and any special requirements..."
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  Thank you for your inquiry! We'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  There was an error sending your inquiry. Please try again or contact us directly.
                </div>
              )}

              <Button type="submit" className="w-full md:w-auto px-8 py-3 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
