"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const UserPlusIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
)

export function ContactAuthCTA() {
  // TODO: Replace with actual authentication state from your auth provider
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          {isLoggedIn ? "Welcome Back, Member!" : "Join Our Safari Community"}
        </CardTitle>
        <CardDescription className="text-base">
          {isLoggedIn 
            ? "Access your tourist dashboard and exclusive safari benefits"
            : "Register as a tourist for exclusive safari deals, personalized itineraries, and priority booking. Staff and admin accounts are created by administrators."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/login" className="flex items-center justify-center space-x-2">
                <UserIcon />
                <span>Access Tourist Dashboard</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/register" className="flex items-center justify-center space-x-2">
                <UserPlusIcon />
                <span>What are you waiting for? Join as Tourist!</span>
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already a member?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        )}
        
        <div className="pt-2 border-t border-primary/20">
          <h4 className="font-semibold mb-2 text-sm">Tourist Account Benefits:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Exclusive safari packages & early bird discounts</li>
            <li>• Personalized itinerary recommendations</li>
            <li>• Priority booking during peak seasons</li>
            <li>• Access to special cultural experiences</li>
            <li>• Direct communication with our safari experts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}