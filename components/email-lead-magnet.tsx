"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Mail } from "lucide-react"

export function EmailLeadMagnet() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Email submitted:", email)
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Download className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-luxury text-primary mb-3">
              Free Safari Planning Guide
            </CardTitle>
            <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto font-serif">
              Get our comprehensive 25-page guide with insider tips, packing lists, best times to visit, and exclusive
              safari secrets from our expert guides.
            </p>
          </CardHeader>

          <CardContent className="max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" className="sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" />
                    Get Free Guide
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-600 mb-4">
                  <Mail className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Check Your Email!</h3>
                <p className="text-muted-foreground">
                  Your free Safari Planning Guide is on its way. Don't forget to check your spam folder.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
