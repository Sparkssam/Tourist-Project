"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Thank you for subscribing! Check your inbox for safari inspiration.")
      setEmail("")
    } catch (error) {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-olive/5 to-caramel/5 border-olive/20">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-luxury text-olive">Join the Pride</h3>
          <p className="text-muted-foreground">
            Receive safari tips, wildlife stories, and exclusive offers delivered to your inbox monthly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        {message && (
          <p className={`text-sm ${message.includes("Thank you") ? "text-green-600" : "text-red-600"}`}>{message}</p>
        )}

        <p className="text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe anytime. No spam, just wildlife wisdom.
        </p>
      </div>
    </Card>
  )
}
