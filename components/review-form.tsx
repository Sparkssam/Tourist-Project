"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Send, CheckCircle2, ExternalLink } from "lucide-react"

const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://www.google.com/search?q=kekeosafaris+tanzania+review"

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

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
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner for Google Review */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-inner border border-gray-100">
              <GoogleIcon />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Prefer to review directly on Google?</h3>
              <p className="text-sm text-muted-foreground">
                Your Google review helps safari travelers worldwide discover Kekeo Safaris.
              </p>
            </div>
          </div>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all flex-shrink-0 text-sm"
          >
            <GoogleIcon />
            <span>Write a Google Review</span>
            <ExternalLink className="w-4 h-4 ml-1 text-gray-500" />
          </a>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-luxury text-primary">Share Your Safari Experience</CardTitle>
            <p className="text-muted-foreground">
              Help other travelers by sharing your safari adventure with Kekeo Safaris
            </p>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="p-8 text-center space-y-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="w-16 h-16 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">Thank You for Your Review!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your feedback has been saved and published to our website. We truly appreciate your support!
                  </p>
                </div>

                {/* Google Review Prompt */}
                <div className="pt-4 border-t border-green-500/20 max-w-md mx-auto space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Would you also like to post this review directly on our Google Business profile?
                  </p>
                  <a
                    href={GOOGLE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all w-full"
                  >
                    <GoogleIcon />
                    <span>Post on Google Reviews Now</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: "", email: "", location: "", tour: "", rating: 5, review: "" })
                  }}
                  className="mt-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  Submit another review
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
                  <label className="block text-sm font-medium mb-2">Your Detailed Review *</label>
                  <Textarea
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Tell us about your safari experience with Kekeo Safaris! What made it special?"
                    rows={5}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    disabled={isSubmitting || formData.rating === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting Review..." : "Submit Review"}
                  </Button>

                  <a
                    href={GOOGLE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-semibold px-4 py-2.5 rounded-md shadow-xs transition-colors text-sm"
                  >
                    <GoogleIcon />
                    <span>Review on Google</span>
                  </a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
