"use client"

import { useEffect, useRef } from "react"

type MapPreviewProps = {
  latitude: number
  longitude: number
  interactive?: boolean
}

export default function MapPreview({ latitude, longitude, interactive = false }: MapPreviewProps) {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const leafletLoadedRef = useRef(false)

  useEffect(() => {
    if (!leafletLoadedRef.current) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        leafletLoadedRef.current = true
        initMap()
      }
      document.head.appendChild(script)
    } else if ((window as any).L) {
      initMap()
    }

    function initMap() {
      if (!containerRef.current || !(window as any).L) return

      const L = (window as any).L

      // Initialize map if not already created
      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          dragging: interactive,
          touchZoom: interactive,
          scrollWheelZoom: interactive,
          doubleClickZoom: interactive,
          boxZoom: interactive,
          keyboard: interactive,
          zoomControl: interactive,
        }).setView([latitude, longitude], 13)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapRef.current)
      }

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude])
      } else {
        markerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current)
      }

      // Center map on marker
      mapRef.current.setView([latitude, longitude])
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [latitude, longitude, interactive])

  return <div ref={containerRef} className="w-full h-full" />
}
