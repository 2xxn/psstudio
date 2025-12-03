"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { getAuthURL } from "@/lib/api"
import { useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      const authUrl = await getAuthURL()

      // Open popup window for OAuth
      const popup = window.open(authUrl, "login", "width=400,height=600")

      // Listen for auth success or error messages
      const messageHandler = (event: MessageEvent) => {
        if (event.data === "auth_success") {
          popup?.close()
          window.removeEventListener("message", messageHandler)
          // Redirect to studio
          window.location.href = "/studio"
        } else if (event.data === "auth_error") {
          popup?.close()
          window.removeEventListener("message", messageHandler)
          toast.error("Authentication failed. Please try again.")
          setIsLoading(false)
        }
      }

      window.addEventListener("message", messageHandler)

      // Handle popup being closed without completing auth
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      <div className="flex flex-col items-center gap-8 flex-1 justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">PSStudio</h1>
        </div>

        <Button
          onClick={handleGoogleLogin}
          size="lg"
          disabled={isLoading}
          className="min-w-[240px] h-12 text-base font-medium shadow-sm hover:shadow-md transition-all"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? "Connecting..." : "Login with Google"}
        </Button>
      </div>

      <footer className="w-full py-6 text-center text-sm text-muted-foreground">
        <div className="flex gap-4 justify-center mb-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
        <div>
          &copy; {new Date().getFullYear()} PSStudio. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
