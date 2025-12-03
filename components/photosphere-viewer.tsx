"use client"

import { useEffect, useRef } from "react"
import type { Photosphere } from "@/components/studio-layout"
import dynamic from "next/dynamic"

// Dynamically import MapPreview to avoid SSR issues with Leaflet
const MapPreview = dynamic(() => import("@/components/map-preview"), {
  ssr: false,
})

type PhotosphereViewerProps = {
  photosphere: Photosphere | null
}

export default function PhotosphereViewer({ photosphere }: PhotosphereViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!photosphere || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple panorama preview (in a real app, use a library like pannellum or three.js)
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = photosphere.imageUrl
    img.onload = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }, [photosphere])

  if (!photosphere) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Select a photosphere to view</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
      {/* Panorama Viewer */}
      <div className="flex-1 min-h-[400px] bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Map Preview */}
      <div className="h-64 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <MapPreview latitude={photosphere.latitude} longitude={photosphere.longitude} interactive={false} />
      </div>
    </div>
  )
}
