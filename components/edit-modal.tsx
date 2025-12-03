"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Photosphere } from "@/components/studio-layout"
import dynamic from "next/dynamic"
import { updatePhoto } from "@/lib/api"
import toast from "react-hot-toast"

const MapEditor = dynamic(() => import("@/components/map-editor"), {
  ssr: false,
})

type EditModalProps = {
  photosphere: Photosphere
  onClose: () => void
  onUpdate: (id: string, latitude: number, longitude: number) => void
}

export default function EditModal({ photosphere, onClose, onUpdate }: EditModalProps) {
  const [latitude, setLatitude] = useState(photosphere.latitude)
  const [longitude, setLongitude] = useState(photosphere.longitude)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updatePhoto(photosphere.id, {
        pose: {
          latLngPair: {
            latitude,
            longitude,
          },
        },
        captureTime: photosphere.captureDate, // Keep existing capture time
      })
      onUpdate(photosphere.id, latitude, longitude)
      toast.success("Location updated successfully! Changes may take a few minutes to appear on Google Maps.")
    } catch (error) {
      console.error("Failed to update photo:", error)
      toast.error("Failed to update photo. Please try again.")
    } finally {
      setIsUpdating(false)
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
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Map */}
          <div className="h-80 rounded-lg overflow-hidden border border-border">
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
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
