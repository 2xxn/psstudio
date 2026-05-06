"use client"

import { Button } from "@/components/ui/button"
import { getAuthURL } from "@/lib/api"
import { useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Link from "next/link"

const features = [
  {
    title: "Upload 360° Photospheres",
    desc: "Select any equirectangular image from your device and publish it to Google Street View in seconds. No command-line tools or API credentials required on your end.",
  },
  {
    title: "Interactive Map Placement",
    desc: "Drop a pin on the embedded Leaflet map to set the exact GPS coordinates of your photo. Zoom in to street level for pixel-perfect placement.",
  },
  {
    title: "Capture Date Control",
    desc: "Attach the real capture date to every photosphere so Google Maps displays the correct timeline. Useful for documentation, construction tracking, or seasonal shoots.",
  },
  {
    title: "Photo Gallery",
    desc: "All your published photospheres appear in a thumbnail sidebar. Click any tile to open the full 360° viewer without leaving the app.",
  },
  {
    title: "Edit Location",
    desc: "Made a placement mistake? Open the edit modal, adjust the pin on the map, and push the updated coordinates to Google Street View instantly.",
  },
  {
    title: "Delete Photos",
    desc: "Remove photospheres from Google Street View directly from the panel. Changes propagate to Google Maps within minutes.",
  },
]

const steps = [
  {
    n: "1",
    title: "Sign in with Google",
    desc: "Grant PSStudio access to your Google Street View account via secure OAuth 2.0. No passwords are stored — only the tokens needed to publish on your behalf.",
  },
  {
    n: "2",
    title: "Upload & place your photo",
    desc: "Choose a 360° equirectangular image, pick the capture date, and drop a pin on the map to set its location. Hit Create when you're ready.",
  },
  {
    n: "3",
    title: "Live on Google Maps",
    desc: "Your photosphere is submitted to the Street View Publish API and usually appears on Google Maps within a few minutes. Share the link directly from the app.",
  },
]

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const authUrl = await getAuthURL()
      const popup = window.open(authUrl, "login", "width=400,height=600")
      const messageHandler = (event: MessageEvent) => {
        if (event.data === "auth_success") {
          popup?.close()
          window.removeEventListener("message", messageHandler)
          window.location.href = "/studio"
        } else if (event.data === "auth_error") {
          popup?.close()
          window.removeEventListener("message", messageHandler)
          toast.error("Authentication failed. Please try again.")
          setIsLoading(false)
        }
      }
      window.addEventListener("message", messageHandler)
      const checkPopupClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopupClosed)
          window.removeEventListener("message", messageHandler)
          setIsLoading(false)
        }
      }, 500)
    } catch (error) {
      console.error("Auth error:", error)
      toast.error("Failed to initiate login. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background">

      {/* ── HERO ── */}
      <section
        className="flex flex-col items-center gap-8 pt-24 pb-16 px-6 w-full"
        aria-labelledby="hero-heading"
      >
        <div className="flex flex-col items-center gap-3">
          <Image src="/favicon.png" alt="PSStudio logo" width={64} height={64} priority />
          <h1 id="hero-heading" className="text-3xl font-semibold text-foreground">PSStudio</h1>
          <p className="text-muted-foreground text-sm text-center max-w-lg">
            Upload, geo-tag, and publish 360° equirectangular photospheres to Google Street View. Manage your entire library — view, edit location, and delete photos — without touching the API.
          </p>
        </div>

        <Button
          onClick={handleGoogleLogin}
          size="lg"
          disabled={isLoading}
          id="login-btn"
          className="min-w-[240px] h-12 text-base font-medium shadow-sm hover:shadow-md transition-all"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isLoading ? "Connecting..." : "Login with Google"}
        </Button>

        {/* Screenshots */}
        <div className="mt-4 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <Image
              src="/preview.png"
              alt="PSStudio dashboard — photosphere gallery and 360° viewer"
              width={900}
              height={560}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <Image
              src="/preview2.png"
              alt="PSStudio — create photosphere with interactive map placement"
              width={900}
              height={560}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <div className="w-full max-w-5xl px-6 space-y-20 pb-24">

        {/* ── WHAT IS PSSTUDIO ── */}
        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-xl font-semibold text-foreground mb-3">
            What is PSStudio? — A Google Street View Photosphere Manager
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            PSStudio is an open-source web application that lets you publish, manage, and delete 360° photospheres on Google Street View — without touching the API directly. It wraps the <strong className="text-foreground font-medium">Google Street View Publish API</strong> in a clean interface so photographers, surveyors, and hobbyists can focus on capturing the world rather than fighting OAuth flows and JSON payloads.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mt-3">
            Once a photo is published, it appears on <strong className="text-foreground font-medium">Google Maps</strong> and is accessible to anyone via Street View. PSStudio keeps a live list of all your published photospheres so you can view, update, or remove them at any time.
          </p>
        </section>

        {/* ── FEATURES ── */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-xl font-semibold text-foreground mb-6">Features — Everything You Need to Publish Photospheres</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-border rounded-xl p-5 bg-background hover:bg-accent/40 transition-colors"
              >
                <dt className="text-sm font-semibold text-foreground mb-1">{f.title}</dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">{f.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-xl font-semibold text-foreground mb-6">How to Publish a 360° Photo to Google Street View</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 list-none">
            {steps.map((s) => (
              <li
                key={s.n}
                className="border border-border rounded-xl p-5 bg-background"
              >
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step {s.n}</span>
                <h3 className="text-sm font-semibold text-foreground mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── USE CASES ── */}
        <section aria-labelledby="usecases-heading">
          <h2 id="usecases-heading" className="text-xl font-semibold text-foreground mb-3">Who Uses a Street View Photosphere Manager?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-4">
            PSStudio is useful for anyone who regularly publishes content to Google Street View:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground max-w-2xl">
            <li className="flex gap-2">
              <span className="text-foreground font-medium shrink-0">Photographers</span>
              — publish virtual tours of locations, businesses, or landmarks directly to Google Maps.
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-medium shrink-0">Surveyors & mappers</span>
              — document areas with geo-tagged 360° imagery for accurate, timestamped records.
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-medium shrink-0">Businesses</span>
              — add indoor or outdoor photospheres to their Google Maps listing to attract visitors.
            </li>
            <li className="flex gap-2">
              <span className="text-foreground font-medium shrink-0">Hobbyists</span>
              — share interesting places, trails, or events as immersive Street View experiences.
            </li>
          </ul>
        </section>

        {/* ── TECH ── */}
        <section aria-labelledby="tech-heading">
          <h2 id="tech-heading" className="text-xl font-semibold text-foreground mb-3">Open Source & Self-Hostable Street View Tool</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            PSStudio is built with <strong className="text-foreground font-medium">Next.js</strong>, <strong className="text-foreground font-medium">TypeScript</strong>, and <strong className="text-foreground font-medium">Tailwind CSS</strong>. It uses the <strong className="text-foreground font-medium">Google Street View Publish API</strong> with OAuth 2.0 for authentication. The source code is available on{" "}
            <a
              href="https://github.com/2xxn/psstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 hover:text-foreground/70"
            >
              GitHub
            </a>
            . You can self-host it with your own Google Cloud credentials in minutes.
          </p>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="flex gap-4 justify-center mb-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <a href="https://github.com/2xxn/psstudio" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
        </div>
        <div>© {new Date().getFullYear()} PSStudio. All rights reserved.</div>
      </footer>

    </div>
  )
}
