"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Send, CheckCircle2 } from "lucide-react"

export function ReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    tour: "",
    rating: 5,
    review: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review")
      }

      setSubmitted(true)
    } catch (error: any) {
      setErrorMessage(error?.message || "There was an error submitting your review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-luxury text-primary">Share Your Safari Experience</CardTitle>
            <p className="text-muted-foreground">
              Submit your story directly to Kekeo Safaris. Your review will be published on our website and sent to our team.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {submitted ? (
              <div className="p-8 text-center space-y-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="w-16 h-16 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Thank You for Your Feedback!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your safari experience has been successfully submitted to Kekeo Safaris and dispatched to our team. A confirmation has been emailed to <strong>{formData.email}</strong>.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: "", email: "", location: "", tour: "", rating: 5, review: "" })
                  }}
                  className="mt-4 text-sm"
                >
                  Submit Another Experience
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
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
                    <label className="block text-sm font-medium mb-2">Your Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. New York, USA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Safari Tour Taken</label>
                    <Select value={formData.tour} onValueChange={(value) => setFormData({ ...formData, tour: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your tour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Serengeti Safari">Serengeti Safari</SelectItem>
                        <SelectItem value="Kilimanjaro Climb">Kilimanjaro Climb</SelectItem>
                        <SelectItem value="Ngorongoro Crater">Ngorongoro Crater</SelectItem>
                        <SelectItem value="Tarangire & Manyara">Tarangire & Manyara</SelectItem>
                        <SelectItem value="Cultural & Bush Safari">Cultural & Bush Safari</SelectItem>
                        <SelectItem value="Zanzibar & Safari Combo">Zanzibar & Safari Combo</SelectItem>
                        <SelectItem value="Custom Safari Tour">Custom Safari Tour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating *</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="focus:outline-none p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-medium text-muted-foreground">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Detailed Experience *</label>
                  <Textarea
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Tell us about your safari experience with Kekeo Safaris! What made it special?"
                    rows={5}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || formData.rating === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting Experience..." : "Send Experience to Kekeo Safaris"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
