import { InquiryHero } from "@/components/inquiry-hero"
import { InquiryForm } from "@/components/inquiry-form"
import { InquiryInfo } from "@/components/inquiry-info"
import { Footer } from "@/components/footer"

export default function InquiriesPage() {
  return (
    <>
      <InquiryHero />
      <InquiryForm />
      <InquiryInfo />
      <Footer />
    </>
  )
}
