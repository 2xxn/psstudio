"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { uploadPhoto, type PhotoMetadata } from "@/lib/api"
import type { Photosphere } from "@/components/studio-layout"
import toast from "react-hot-toast"

const MapEditor = dynamic(() => import("@/components/map-editor"), {
  ssr: false,
})

type CreateModalProps = {
  onClose: () => void
  onCreate: (photosphere: Photosphere) => void
}

declare global {
  interface Window {
    EXIF: any
  }
}

export default function CreateModal({ onClose, onCreate }: CreateModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [latitude, setLatitude] = useState(40.7128)
  const [longitude, setLongitude] = useState(-74.006)
  const [captureDate, setCaptureDate] = useState(new Date().toISOString().split("T")[0])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Try to extract EXIF data
    try {
      const arrayBuffer = await selectedFile.arrayBuffer()

      // Load EXIF library dynamically
      if (typeof window !== "undefined" && !window.EXIF) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/exif-js"
        document.head.appendChild(script)
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      if (window.EXIF) {
        const exifData = window.EXIF.readFromBinaryFile(arrayBuffer)
        console.log("[v0] EXIF Data:", exifData)

        // Extract GPS coordinates if available
        if (exifData.GPSLatitude && exifData.GPSLongitude) {
          const lat = dmsToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef || "N")
          const lng = dmsToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef || "E")
          setLatitude(lat)
          setLongitude(lng)
          console.log("[v0] Extracted GPS:", { lat, lng })
        }

        // Extract capture date if available
        if (exifData.DateTimeOriginal) {
          const date = parseExifDate(exifData.DateTimeOriginal)
          setCaptureDate(date.toISOString().split("T")[0])
          console.log("[v0] Extracted date:", date)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to extract EXIF:", error)
    }
  }

  const dmsToDecimal = (dmsArray: any[], ref: string): number => {
    const [deg, min, sec] = dmsArray.map((v) =>
      typeof v === "object" && v.numerator !== undefined ? v.numerator / v.denominator : v,
    )
    let decimal = deg + min / 60 + sec / 3600
    if (ref === "S" || ref === "W") decimal = -decimal
    return decimal
  }

  const parseExifDate = (exifString: string): Date => {
    const [datePart, timePart] = exifString.split(" ")
    const [year, month, day] = datePart.split(":").map(Number)
    const [hour, minute, second] = timePart.split(":").map(Number)
    return new Date(year, month - 1, day, hour, minute, second)
  }

  const handleCreate = async () => {
    if (!file) return

    setIsUploading(true)
    try {
      const metadata: PhotoMetadata = {
        pose: {
          latLngPair: {
            latitude,
            longitude,
          },
        },
        captureTime: new Date(captureDate).toISOString(),
      }

      const photo = await uploadPhoto(file, metadata)

      // Convert to Photosphere type
      const newPhotosphere: Photosphere = {
        id: photo.photoId.id,
        name: file.name,
        thumbnailUrl: photo.thumbnailUrl,
        shareLink: photo.shareLink,
        latitude,
        longitude,
        captureDate: photo.captureTime,
        uploadDate: new Date().toISOString(),
      }

      onCreate(newPhotosphere)
      toast.success(
        "Photo uploaded successfully! It may take a few minutes to a few hours to appear in your Google Maps profile.",
      )
    } catch (error) {
      console.error("Failed to upload photo:", error)
      toast.error("Failed to upload photo. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
  }

  return (
    <Dialog open={true} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-2xl z-50000">
        <DialogHeader>
          <DialogTitle>Create New Photosphere</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Capture Date */}
          <div className="space-y-2">
            <Label htmlFor="captureDate">Capture Date</Label>
            <Input id="captureDate" type="date" value={captureDate} onChange={(e) => setCaptureDate(e.target.value)} />
          </div>

          {/* Map */}
          <div className="h-64 rounded-lg overflow-hidden border border-border">
            <MapEditor latitude={latitude} longitude={longitude} onMapClick={handleMapClick} />
          </div>

          {/* Coordinates Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(Number.parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
