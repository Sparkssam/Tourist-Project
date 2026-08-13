"use client"

import { Suspense } from "react"
import { InquiryForm } from "@/components/inquiry-form"

export default function InquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f5f1e6]">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a67c52] mx-auto mb-4"></div>
            <p className="text-[#5c4d3f] font-semibold">Loading Safari Enquiry Portal...</p>
          </div>
        </div>
      }
    >
      <InquiryForm />
    </Suspense>
  )
}
