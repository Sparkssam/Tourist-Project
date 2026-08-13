"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasPrompted, setHasPrompted] = useState(false)

  // Show subtle greeting popup after 5 seconds on desktop/mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const quickMessages = [
    { text: "🦒 Inquire about Serengeti Safari", msg: "Hello Elibariki, I would like to inquire about a Serengeti & Ngorongoro safari." },
    { text: "🏔️ Kilimanjaro Climb question", msg: "Hello! I am planning to climb Mount Kilimanjaro and have questions about routes and preparation." },
    { text: "✨ Custom Tailor-Made Trip", msg: "Hi Elibariki, I want to design a custom Tanzania safari for our group. Can you help?" },
  ]

  const sendWhatsApp = (customMsg?: string) => {
    const text = encodeURIComponent(customMsg || "Hello Elibariki, I am visiting kekeosafaris.com and would like to plan a Tanzania safari!")
    window.open(`https://wa.me/255766860273?text=${text}`, "_blank")
  }

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="mb-3 w-[310px] sm:w-[350px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/african-safari-guide-with-binoculars-in-tanzania-w.jpeg"
                  alt="Elibariki Basso"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Elibariki Basso</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                  Online · Lead Safari Specialist
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-muted/20 space-y-3">
            <div className="bg-card p-3 rounded-xl border border-border text-xs leading-relaxed text-card-foreground shadow-xs">
              <p className="font-serif">
                Jambo! 🌿 How can I help you plan your dream Tanzania safari or Kilimanjaro expedition today?
              </p>
              <span className="text-[10px] text-muted-foreground block text-right mt-1">Direct via WhatsApp</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-1">
                Quick Options:
              </p>
              {quickMessages.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendWhatsApp(q.msg)}
                  className="w-full text-left text-xs bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-border hover:border-emerald-500/30 text-foreground p-2.5 rounded-xl transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{q.text}</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>

            <button
              onClick={() => sendWhatsApp()}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Directly with Elibariki</span>
            </button>
          </div>
        </div>
      )}

      {/* Greeting Bubble when closed */}
      {!isOpen && hasPrompted && (
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer mb-2 bg-card text-card-foreground border border-border/80 text-xs py-1.5 px-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce hover:bg-muted/80 transition-all max-w-[260px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="truncate font-medium">Chat with safari expert</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasPrompted(false)
        }}
        className={`bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
          !isOpen ? "shadow-emerald-600/30" : ""
        }`}
        aria-label="Open WhatsApp conversation"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-bold pr-1">WhatsApp</span>
      </button>
    </aside>
  )
}
