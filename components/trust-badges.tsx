"use client"

import { ShieldCheck, Award, HeartHandshake, Plane } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      title: "Licensed Tour Operator",
      org: "Tanzania Tourism Board (TTB)",
      desc: "Officially registered Class-A safari operator in the United Republic of Tanzania",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Active Member",
      org: "TATO (Tanzania Assoc. of Tour Operators)",
      desc: "Committed to strict ethical guiding, fair porter wages, and wildlife conservation",
      icon: Award,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "AMREF Flying Doctors",
      org: "Emergency Evacuation Guarantee",
      desc: "Comprehensive 500km air ambulance medical rescue coverage for all safari guests",
      icon: Plane,
      color: "text-sky-600 bg-sky-500/10",
    },
    {
      title: "100% Tailor-Made",
      org: "Direct Local Operator",
      desc: "No middlemen fees. Work directly with native Tanzanian safari specialists",
      icon: HeartHandshake,
      color: "text-rose-600 bg-rose-500/10",
    },
  ]

  return (
    <section className="py-12 px-4 border-y border-border bg-card/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs uppercase font-bold tracking-widest text-primary">Your Peace of Mind Matters</p>
          <h3 className="text-2xl font-luxury text-card-foreground mt-1">Official Accreditations & Safety Guarantees</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b, i) => {
            const Icon = b.icon
            return (
              <div
                key={i}
                className="bg-card border border-border/80 p-5 rounded-2xl flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${b.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-card-foreground leading-tight">{b.title}</h4>
                      <span className="text-[11px] font-semibold text-primary">{b.org}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-serif leading-relaxed">{b.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
