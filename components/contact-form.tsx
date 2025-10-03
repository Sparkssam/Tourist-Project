"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    tourInterest: "",
    message: "",
    preferredContact: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Build comprehensive message with all details
      const fullMessage = `${formData.message}

${formData.tourInterest ? `\nTour Interest: ${formData.tourInterest}` : ''}
${formData.preferredContact ? `Preferred Contact Method: ${formData.preferredContact}` : ''}`

      // Save to Supabase inquiries table
      const { error } = await supabase
        .from('inquiries')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || 'General Contact Message',
          message: fullMessage.trim(),
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
        tourInterest: "",
        message: "",
        preferredContact: "",
      })

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus("error")
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-luxury text-primary flex items-center">
          <Mail className="h-6 w-6 mr-2" />
          Send Us a Message
        </CardTitle>
        <p className="text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
              <Select
                value={formData.preferredContact}
                onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tour Interest</label>
              <Select
                value={formData.tourInterest}
                onValueChange={(value) => setFormData({ ...formData, tourInterest: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tour type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wildlife-safari">Wildlife Safari</SelectItem>
                  <SelectItem value="kilimanjaro">Mount Kilimanjaro</SelectItem>
                  <SelectItem value="cultural-tour">Cultural Tour</SelectItem>
                  <SelectItem value="beach-extension">Beach Extension</SelectItem>
                  <SelectItem value="custom-tour">Custom Tour</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message *</label>
            <Textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your dream safari, travel dates, group size, or any questions you have..."
              rows={5}
            />
          </div>

          {submitStatus === "success" && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for your message! We'll get back to you within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertDescription>
                There was an error sending your message. Please try again or contact us directly.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
