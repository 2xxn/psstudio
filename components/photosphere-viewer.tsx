"use client"

import { useEffect, useRef } from "react"
import type { Photosphere } from "@/components/studio-layout"
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import dynamic from "next/dynamic"

// Dynamically import MapPreview to avoid SSR issues with Leaflet
const MapPreview = dynamic(() => import("@/components/map-preview"), {
  ssr: false,
})

type PhotosphereViewerProps = {
  photosphere: Photosphere | null
}

export default function PhotosphereViewer({ photosphere }: PhotosphereViewerProps) {
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
        <ReactPhotoSphereViewer
          src={photosphere.downloadUrl || photosphere.thumbnailUrl}
          height={"100vh"}
          width={"100vw"}
          defaultZoomLvl={0}
        ></ReactPhotoSphereViewer>
      </div>

      {/* Map Preview */}
      <div className="h-64 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <MapPreview latitude={photosphere.latitude} longitude={photosphere.longitude} interactive={true} />
      </div>
    </div>
  )
}
