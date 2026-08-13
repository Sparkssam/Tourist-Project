"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Send, User, Mail, Phone, Globe, MapPin, Users, Calendar, Tent, Star, Heart, Camera, Bird, Mountain, Waves, Leaf, Baby, Utensils, ChevronDown, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  // Personal
  name: string
  email: string
  phone: string
  country: string
  nationality: string
  // Safari details
  tourTypes: string[]
  specificTour: string
  // Travel planning
  travelDateFrom: string
  travelDateTo: string
  flexibility: string
  adults: number
  children: number
  childrenAges: string
  // Accommodation
  accommodation: string
  // Interests & extras
  interests: string[]
  dietary: string
  budget: string
  specialOccasion: string
  extraNotes: string
}

const INITIAL: FormData = {
  name: "", email: "", phone: "", country: "", nationality: "",
  tourTypes: [], specificTour: "",
  travelDateFrom: "", travelDateTo: "", flexibility: "flexible",
  adults: 2, children: 0, childrenAges: "",
  accommodation: "",
  interests: [], dietary: "", budget: "", specialOccasion: "", extraNotes: "",
}

// ─── Option data ──────────────────────────────────────────────────────────────
const TOUR_TYPES = [
  { id: "wildlife",   label: "Wildlife Safari",    icon: "🦁", desc: "Big Five & great migration"     },
  { id: "mountain",   label: "Mountain Trekking",  icon: "🏔️", desc: "Kilimanjaro & highlands"         },
  { id: "beach",      label: "Beach Extension",    icon: "🏖️", desc: "Zanzibar & coastal retreats"     },
  { id: "cultural",   label: "Cultural Immersion", icon: "🏺", desc: "Maasai villages & local life"    },
  { id: "birding",    label: "Birdwatching",       icon: "🦅", desc: "500+ species across Tanzania"   },
  { id: "adventure",  label: "Adventure Activities",icon: "🪂", desc: "Hot air balloons, rafting & more"},
  { id: "photography",label: "Photography Safari", icon: "📷", desc: "Expert-guided photo sessions"    },
  { id: "family",     label: "Family Safari",      icon: "👨‍👩‍👧", desc: "Child-friendly itineraries"      },
]

const ACCOMMODATIONS = [
  { id: "camping",   label: "Budget Camping",      stars: 1, desc: "Basic tented camps, shared facilities" },
  { id: "standard",  label: "Standard Lodges",     stars: 3, desc: "Comfortable rooms, private facilities" },
  { id: "luxury",    label: "Luxury Camps",        stars: 4, desc: "Premium tented suites, full board"     },
  { id: "ultra",     label: "Ultra-Luxury",        stars: 5, desc: "Private conservancies, butler service" },
]

const INTERESTS = [
  { id: "photography", label: "Photography",    Icon: Camera  },
  { id: "birdwatching",label: "Birdwatching",   Icon: Bird    },
  { id: "hiking",      label: "Hiking & Walks", Icon: Mountain},
  { id: "wellness",    label: "Wellness & Spa", Icon: Leaf    },
  { id: "beach",       label: "Beach & Ocean",  Icon: Waves   },
  { id: "culture",     label: "Local Culture",  Icon: Globe   },
  { id: "family",      label: "Family-Friendly",Icon: Baby    },
  { id: "romance",     label: "Honeymoon",      Icon: Heart   },
]

const BUDGETS = [
  { id: "1000-2500",  label: "$1,000 – $2,500",   desc: "per person"  },
  { id: "2500-5000",  label: "$2,500 – $5,000",   desc: "per person"  },
  { id: "5000-10000", label: "$5,000 – $10,000",  desc: "per person"  },
  { id: "10000+",     label: "$10,000+",           desc: "per person"  },
  { id: "flexible",   label: "Flexible Budget",    desc: "let us advise"},
]

const FLEXIBILITY = [
  { id: "fixed",    label: "Fixed Dates",     desc: "I have specific dates" },
  { id: "flexible", label: "Flexible ±1 week", desc: "A week either side is fine" },
  { id: "open",     label: "Open",            desc: "Any time in that month" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeading({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #a67c52, #c49a6c)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0,
        boxShadow: "0 4px 12px rgba(166,124,82,0.35)"
      }}>
        {step}
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#4a3f35", marginBottom: 2 }}>{title}</h2>
        <p style={{ fontSize: 14, color: "#7d6b56" }}>{subtitle}</p>
      </div>
    </div>
  )
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#5c4d3f", marginBottom: 6, letterSpacing: "0.02em" }}>
      {children} {required && <span style={{ color: "#a67c52" }}>*</span>}
    </label>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: "#9d8c7a", marginTop: 4 }}>{children}</p>
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function InquiryForm() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const tourParam = searchParams.get("tour")
    if (tourParam) {
      setForm(prev => ({ ...prev, specificTour: tourParam }))
    }
  }, [searchParams])

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: val }))
  }, [])

  const toggleArr = useCallback((key: "tourTypes" | "interests", val: string) => {
    setForm(prev => {
      const arr = prev[key] as string[]
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setStatus("submitting")
    setErrorMsg("")

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: `Safari Enquiry — ${form.tourTypes.join(", ") || "General"} — ${form.nationality || form.country}`,
      message: [
        form.extraNotes,
        form.dietary ? `Dietary: ${form.dietary}` : "",
        form.specialOccasion ? `Special occasion: ${form.specialOccasion}` : "",
        form.childrenAges ? `Children ages: ${form.childrenAges}` : "",
        form.interests.length ? `Interests: ${form.interests.join(", ")}` : "",
      ].filter(Boolean).join("\n\n") || "—",
      selectedTour: form.specificTour || form.tourTypes.join(", "),
      travelDates: `${form.travelDateFrom || "TBD"} → ${form.travelDateTo || "TBD"} (${form.flexibility})`,
      groupSize: `${form.adults} adult${form.adults !== 1 ? "s" : ""}${form.children > 0 ? `, ${form.children} child${form.children !== 1 ? "ren" : ""}` : ""}`,
      // Extra fields included in the notification email via the API
      country: form.country,
      nationality: form.nationality,
      accommodation: form.accommodation,
      budget: form.budget,
      interests: form.interests.join(", "),
      flexibility: form.flexibility,
      tourTypes: form.tourTypes.join(", "),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setForm(INITIAL)
      } else {
        setStatus("error")
        setErrorMsg(data?.error || data?.details || "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please check your connection and try again.")
    }
  }

  if (status === "success") {
    return (
      <section style={{ padding: "64px 16px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#52a67c,#3d8f63)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#4a3f35", marginBottom: 12 }}>Enquiry Received!</h2>
          <p style={{ fontSize: 16, color: "#7d6b56", lineHeight: 1.7, marginBottom: 32 }}>
            Thank you for reaching out. Our safari specialists will review your enquiry and send you a personalised proposal within <strong>24 hours</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { icon: "✉️", label: "Confirmation email sent" },
              { icon: "📋", label: "Itinerary being crafted" },
              { icon: "🤝", label: "Expert assigned to you" },
            ].map(item => (
              <div key={item.label} style={{ background: "#f5f1e6", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 13, color: "#7d6b56", fontWeight: 500 }}>{item.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStatus("idle")}
            style={{ background: "transparent", border: "2px solid #a67c52", color: "#a67c52", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
          >
            Submit Another Enquiry
          </button>
        </div>
      </section>
    )
  }

  // ── Shared input style ──
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #dbd0ba", background: "#fffcf5",
    fontSize: 14, color: "#4a3f35", outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none", WebkitAppearance: "none", cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a67c52' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  }

  const sectionStyle: React.CSSProperties = {
    background: "#fffcf5",
    borderRadius: 16,
    padding: "32px 28px",
    border: "1px solid #ece5d8",
    boxShadow: "0 2px 12px rgba(74,63,53,0.06)",
    marginBottom: 24,
  }

  const dividerStyle: React.CSSProperties = {
    border: "none", borderTop: "1px solid #ece5d8", margin: "24px 0",
  }

  return (
    <section style={{ padding: "48px 16px", background: "linear-gradient(180deg, #f5f1e6 0%, #ede7d9 100%)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg, #a67c52, #c49a6c)", borderRadius: 100, padding: "6px 20px", marginBottom: 16 }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Plan Your Safari</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#4a3f35", marginBottom: 12, lineHeight: 1.2 }}>
            Tell Us About Your Dream Adventure
          </h1>
          <p style={{ fontSize: 16, color: "#7d6b56", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            The more you share, the better we can tailor your experience. Every detail helps us craft something truly unforgettable.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Personal Details ─────────────────────────────── */}
          <div style={sectionStyle}>
            <SectionHeading step="1" title="Your Details" subtitle="How we'll reach you with your personalised proposal" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              <div>
                <FieldLabel htmlFor="name" required>Full Name</FieldLabel>
                <div style={{ position: "relative" }}>
                  <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="name" required value={form.name} onChange={e => set("name", e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 38 }} placeholder="Your full name" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="email" type="email" required value={form.email} onChange={e => set("email", e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 38 }} placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="phone">Phone / WhatsApp</FieldLabel>
                <div style={{ position: "relative" }}>
                  <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 38 }} placeholder="+1 555 123 4567" />
                </div>
                <FieldHint>Include country code for WhatsApp contact</FieldHint>
              </div>

              <div>
                <FieldLabel htmlFor="country">Country of Residence</FieldLabel>
                <div style={{ position: "relative" }}>
                  <MapPin style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="country" value={form.country} onChange={e => set("country", e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 38 }} placeholder="e.g., United Kingdom" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                <div style={{ position: "relative" }}>
                  <Globe style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="nationality" value={form.nationality} onChange={e => set("nationality", e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 38 }} placeholder="e.g., British" />
                </div>
                <FieldHint>Helps us advise on visa requirements</FieldHint>
              </div>
            </div>
          </div>

          {/* ── Section 2: Safari Type ───────────────────────────────────── */}
          <div style={sectionStyle}>
            <SectionHeading step="2" title="Safari Type" subtitle="Select all that interest you — we can combine multiple experiences" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
              {TOUR_TYPES.map(t => {
                const active = form.tourTypes.includes(t.id)
                return (
                  <button key={t.id} type="button" onClick={() => toggleArr("tourTypes", t.id)}
                    style={{
                      padding: "14px 12px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                      border: active ? "2px solid #a67c52" : "1.5px solid #dbd0ba",
                      background: active ? "linear-gradient(135deg,#fdf6ec,#faebd7)" : "#fffcf5",
                      transition: "all 0.18s", position: "relative",
                      boxShadow: active ? "0 2px 12px rgba(166,124,82,0.2)" : "none",
                    }}>
                    {active && (
                      <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: "#a67c52", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle2 style={{ width: 12, height: 12, color: "#fff" }} />
                      </div>
                    )}
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#4a3f35", marginBottom: 3 }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#7d6b56" }}>{t.desc}</div>
                  </button>
                )
              })}
            </div>

            <hr style={dividerStyle} />

            <div>
              <FieldLabel htmlFor="specificTour">Specific Tour or Destination in Mind?</FieldLabel>
              <input id="specificTour" value={form.specificTour} onChange={e => set("specificTour", e.target.value)}
                style={inputStyle} placeholder="e.g., Serengeti Great Migration, Kilimanjaro Machame Route, Zanzibar + Safari combo..." />
              <FieldHint>Leave blank if you'd like our experts to recommend the best option</FieldHint>
            </div>
          </div>

          {/* ── Section 3: Travel Dates & Group ─────────────────────────── */}
          <div style={sectionStyle}>
            <SectionHeading step="3" title="Travel Dates & Group" subtitle="Give us your ideal window — we'll check availability and seasonal highlights" />

            {/* Date range */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 24 }}>
              <div>
                <FieldLabel htmlFor="dateFrom">Arrival Date</FieldLabel>
                <div style={{ position: "relative" }}>
                  <Calendar style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="dateFrom" type="date" value={form.travelDateFrom} onChange={e => set("travelDateFrom", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    style={{ ...inputStyle, paddingLeft: 38 }} />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="dateTo">Departure Date</FieldLabel>
                <div style={{ position: "relative" }}>
                  <Calendar style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#a67c52" }} />
                  <input id="dateTo" type="date" value={form.travelDateTo} onChange={e => set("travelDateTo", e.target.value)}
                    min={form.travelDateFrom || new Date().toISOString().split("T")[0]}
                    style={{ ...inputStyle, paddingLeft: 38 }} />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="flexibility">Date Flexibility</FieldLabel>
                <div style={{ position: "relative" }}>
                  <select id="flexibility" value={form.flexibility} onChange={e => set("flexibility", e.target.value)} style={selectStyle}>
                    {FLEXIBILITY.map(f => <option key={f.id} value={f.id}>{f.label} — {f.desc}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Trip duration helper */}
            {form.travelDateFrom && form.travelDateTo && (() => {
              const days = Math.round((new Date(form.travelDateTo).getTime() - new Date(form.travelDateFrom).getTime()) / 86400000)
              if (days > 0) return (
                <div style={{ background: "linear-gradient(135deg,#fdf6ec,#faebd7)", border: "1px solid #dbd0ba", borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📅</span>
                  <span style={{ fontSize: 14, color: "#5c4d3f", fontWeight: 600 }}>
                    {days}-day trip planned
                    {days < 4 && " — consider a longer stay to experience more"}
                    {days >= 7 && days < 14 && " — perfect for a comprehensive safari"}
                    {days >= 14 && " — excellent! Allows a deep Tanzania experience"}
                  </span>
                </div>
              )
            })()}

            <hr style={dividerStyle} />

            {/* Group size */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
              <div>
                <FieldLabel htmlFor="adults">Adults</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button type="button" onClick={() => set("adults", Math.max(1, form.adults - 1))}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #dbd0ba", background: "#fffcf5", cursor: "pointer", fontSize: 18, color: "#a67c52", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 700, color: "#4a3f35" }}>{form.adults}</div>
                  <button type="button" onClick={() => set("adults", form.adults + 1)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #a67c52", background: "linear-gradient(135deg,#a67c52,#c49a6c)", cursor: "pointer", fontSize: 18, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="children">Children (under 16)</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button type="button" onClick={() => set("children", Math.max(0, form.children - 1))}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #dbd0ba", background: "#fffcf5", cursor: "pointer", fontSize: 18, color: "#a67c52", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 700, color: "#4a3f35" }}>{form.children}</div>
                  <button type="button" onClick={() => set("children", form.children + 1)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #a67c52", background: "linear-gradient(135deg,#a67c52,#c49a6c)", cursor: "pointer", fontSize: 18, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>

              {form.children > 0 && (
                <div>
                  <FieldLabel htmlFor="childrenAges">Children's Ages</FieldLabel>
                  <input id="childrenAges" value={form.childrenAges} onChange={e => set("childrenAges", e.target.value)}
                    style={inputStyle} placeholder="e.g., 6, 9, 14" />
                  <FieldHint>Helps us recommend age-appropriate activities</FieldHint>
                </div>
              )}
            </div>

            {/* Group summary pill */}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Users style={{ width: 16, height: 16, color: "#a67c52" }} />
              <span style={{ fontSize: 13, color: "#7d6b56", fontWeight: 500 }}>
                Group: <strong style={{ color: "#4a3f35" }}>{form.adults} adult{form.adults !== 1 ? "s" : ""}{form.children > 0 ? ` + ${form.children} child${form.children !== 1 ? "ren" : ""}` : ""}</strong>
                {form.adults >= 8 && " — group rates may apply"}
              </span>
            </div>
          </div>

          {/* ── Section 4: Accommodation ─────────────────────────────────── */}
          <div style={sectionStyle}>
            <SectionHeading step="4" title="Accommodation Preference" subtitle="Choose your comfort level — we'll suggest the best lodges within that tier" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {ACCOMMODATIONS.map(a => {
                const active = form.accommodation === a.id
                return (
                  <button key={a.id} type="button" onClick={() => set("accommodation", a.id)}
                    style={{
                      padding: "16px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                      border: active ? "2px solid #a67c52" : "1.5px solid #dbd0ba",
                      background: active ? "linear-gradient(135deg,#fdf6ec,#faebd7)" : "#fffcf5",
                      transition: "all 0.18s",
                      boxShadow: active ? "0 2px 12px rgba(166,124,82,0.2)" : "none",
                    }}>
                    <div style={{ display: "flex", marginBottom: 8 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} style={{ width: 13, height: 13, color: i < a.stars ? "#c49a6c" : "#dbd0ba", fill: i < a.stars ? "#c49a6c" : "none" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#4a3f35", marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: "#7d6b56", lineHeight: 1.5 }}>{a.desc}</div>
                    {active && <div style={{ marginTop: 8, fontSize: 11, color: "#a67c52", fontWeight: 600 }}>✓ Selected</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Section 5: Budget ────────────────────────────────────────── */}
          <div style={sectionStyle}>
            <SectionHeading step="5" title="Approximate Budget" subtitle="Per person, excluding international flights — helps us find the best value options" />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {BUDGETS.map(b => {
                const active = form.budget === b.id
                return (
                  <button key={b.id} type="button" onClick={() => set("budget", b.id)}
                    style={{
                      padding: "10px 18px", borderRadius: 100, cursor: "pointer",
                      border: active ? "2px solid #a67c52" : "1.5px solid #dbd0ba",
                      background: active ? "linear-gradient(135deg,#a67c52,#c49a6c)" : "#fffcf5",
                      color: active ? "#fff" : "#5c4d3f",
                      fontSize: 13, fontWeight: 600,
                      transition: "all 0.18s",
                      boxShadow: active ? "0 2px 10px rgba(166,124,82,0.35)" : "none",
                    }}>
                    {b.label}
                    {b.desc !== "per person" && <span style={{ opacity: 0.8, fontWeight: 400, marginLeft: 4 }}>— {b.desc}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Section 6: Interests & Extras ───────────────────────────── */}
          <div style={sectionStyle}>
            <SectionHeading step="6" title="Interests & Special Details" subtitle="Help us personalise every aspect of your journey" />

            {/* Interests */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#5c4d3f", marginBottom: 12 }}>What excites you most? <span style={{ color: "#7d6b56", fontWeight: 400 }}>(select all that apply)</span></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {INTERESTS.map(({ id, label, Icon }) => {
                  const active = form.interests.includes(id)
                  return (
                    <button key={id} type="button" onClick={() => toggleArr("interests", id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "8px 16px", borderRadius: 100, cursor: "pointer",
                        border: active ? "2px solid #a67c52" : "1.5px solid #dbd0ba",
                        background: active ? "linear-gradient(135deg,#fdf6ec,#faebd7)" : "#fffcf5",
                        color: active ? "#a67c52" : "#5c4d3f",
                        fontSize: 13, fontWeight: 600,
                        transition: "all 0.18s",
                        boxShadow: active ? "0 2px 8px rgba(166,124,82,0.2)" : "none",
                      }}>
                      <Icon style={{ width: 14, height: 14 }} />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <hr style={dividerStyle} />

            {/* Extra fields */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 20 }}>
              <div>
                <FieldLabel htmlFor="dietary">Dietary Requirements</FieldLabel>
                <input id="dietary" value={form.dietary} onChange={e => set("dietary", e.target.value)}
                  style={inputStyle} placeholder="Vegetarian, vegan, gluten-free, allergies..." />
              </div>

              <div>
                <FieldLabel htmlFor="occasion">Special Occasion</FieldLabel>
                <input id="occasion" value={form.specialOccasion} onChange={e => set("specialOccasion", e.target.value)}
                  style={inputStyle} placeholder="Honeymoon, anniversary, birthday..." />
                <FieldHint>We'll arrange a special surprise!</FieldHint>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="notes">Additional Notes or Requests</FieldLabel>
              <textarea id="notes" rows={5} value={form.extraNotes} onChange={e => set("extraNotes", e.target.value)}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                placeholder="Share anything else that will help us plan your perfect safari — mobility considerations, preferred pace (slow & relaxed vs action-packed), previous safari experience, specific wildlife you dream of seeing, camera equipment you're bringing, preferred vehicle type, or any questions you have..." />
              <FieldHint>No question is too big or too small — the more detail you share, the better we can serve you</FieldHint>
            </div>
          </div>

          {/* ── Error message ─────────────────────────────────────────────── */}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 12, marginBottom: 24 }}>
              <AlertCircle style={{ width: 20, height: 20, color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#991b1b", marginBottom: 2 }}>Could not send your enquiry</p>
                <p style={{ fontSize: 13, color: "#b91c1c" }}>{errorMsg || "Please try again or reach us directly via WhatsApp."}</p>
              </div>
            </div>
          )}

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <div style={{ background: "linear-gradient(135deg,#4a3f35,#6b5a4a)", borderRadius: 16, padding: "32px 28px", textAlign: "center" }}>
            <h3 style={{ color: "#fffcf5", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ready to start planning?</h3>
            <p style={{ color: "#c4b49a", fontSize: 14, marginBottom: 24 }}>
              Our safari specialists will review your enquiry and reply with a personalised itinerary within 24 hours.
            </p>

            {/* Summary chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28 }}>
              {form.tourTypes.length > 0 && <span style={{ background: "rgba(166,124,82,0.3)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#e8d5b7" }}>🦁 {form.tourTypes.map(t => TOUR_TYPES.find(x => x.id === t)?.label).join(", ")}</span>}
              {(form.travelDateFrom || form.travelDateTo) && <span style={{ background: "rgba(166,124,82,0.3)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#e8d5b7" }}>📅 {form.travelDateFrom || "?"} → {form.travelDateTo || "?"}</span>}
              {(form.adults > 0) && <span style={{ background: "rgba(166,124,82,0.3)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#e8d5b7" }}>👥 {form.adults} adult{form.adults !== 1 ? "s" : ""}{form.children > 0 ? ` + ${form.children} child${form.children !== 1 ? "ren" : ""}` : ""}</span>}
              {form.accommodation && <span style={{ background: "rgba(166,124,82,0.3)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#e8d5b7" }}>🏕️ {ACCOMMODATIONS.find(a => a.id === form.accommodation)?.label}</span>}
              {form.budget && <span style={{ background: "rgba(166,124,82,0.3)", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#e8d5b7" }}>💰 {BUDGETS.find(b => b.id === form.budget)?.label}</span>}
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || !form.name || !form.email}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: (!form.name || !form.email) ? "#6b5a4a" : "linear-gradient(135deg, #c49a6c, #a67c52)",
                color: "#fff", border: "none", borderRadius: 12,
                padding: "16px 48px", fontSize: 16, fontWeight: 700, cursor: (!form.name || !form.email) ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(196,154,108,0.4)",
                transition: "all 0.2s",
                opacity: status === "submitting" ? 0.85 : 1,
              }}
            >
              {status === "submitting" ? (
                <><Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} /> Sending Your Enquiry...</>
              ) : (
                <><Send style={{ width: 20, height: 20 }} /> Send My Enquiry</>
              )}
            </button>

            <p style={{ color: "#8a7a6a", fontSize: 12, marginTop: 16 }}>
              🔒 Your details are private and never shared with third parties
            </p>
          </div>
        </form>

        <style>{`
          input:focus, textarea:focus, select:focus {
            border-color: #a67c52 !important;
            box-shadow: 0 0 0 3px rgba(166,124,82,0.15);
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </section>
  )
}
