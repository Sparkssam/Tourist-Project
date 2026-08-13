"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export function EmailLeadMagnet() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const res = await fetch("/api/send-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubmitStatus("success")
        setEmail("")
      } else {
        setSubmitStatus("error")
        setErrorMessage(data?.error || data?.details || "Failed to send guide. Please try again.")
      }
    } catch (err: any) {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-border shadow-xl">
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
              Get our comprehensive guide with insider tips, packing lists, best times to visit, and exclusive
              safari secrets delivered directly to your email.
            </p>
          </CardHeader>

          <CardContent className="max-w-md mx-auto">
            {submitStatus !== "success" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button type="submit" className="sm:w-auto font-semibold" disabled={isSubmitting || !email}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Get Free Guide
                      </>
                    )}
                  </Button>
                </div>

                {submitStatus === "error" && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  🔒 We respect your privacy. No spam ever.
                </p>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Guide Sent to Your Email!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your inbox for your official Safari Planning Guide. Don't forget to check your spam or promotions tab if you don't see it right away.
                </p>
                <Button onClick={() => setSubmitStatus("idle")} variant="outline" size="sm">
                  Send to another email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
