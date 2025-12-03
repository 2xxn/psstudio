"use client"

import { useState, useEffect } from "react"
import PhotosphereDrawer from "@/components/photosphere-drawer"
import PhotosphereViewer from "@/components/photosphere-viewer"
import PhotospherePanel from "@/components/photosphere-panel"
import EditModal from "@/components/edit-modal"
import CreateModal from "@/components/create-modal"
import { listPhotos, deletePhoto, type Photo } from "@/lib/api"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"

export type Photosphere = {
  id: string
  name: string
  thumbnailUrl: string
  shareLink: string
  latitude: number
  longitude: number
  captureDate: string
  uploadDate: string
  downloadUrl?: string
}

function photoToPhotosphere(photo: Photo): Photosphere {
  const idLength = photo.photoId.id.length;
  return {
    id: photo.photoId.id,
    name: `Photo ${photo.photoId.id.slice(idLength - 8, idLength)}`,
    thumbnailUrl: photo.thumbnailUrl,
    shareLink: photo.shareLink,
    latitude: photo.pose.latLngPair.latitude,
    longitude: photo.pose.latLngPair.longitude,
    captureDate: photo.captureTime,
    uploadDate: photo.uploadTime,
    downloadUrl: photo.downloadUrl,
  }
}

export default function StudioLayout() {
  const [photospheres, setPhotospheres] = useState<Photosphere[]>([])
  const [selectedPhotosphere, setSelectedPhotosphere] = useState<Photosphere | null>(null)
  const [editingPhotosphere, setEditingPhotosphere] = useState<Photosphere | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      setIsLoading(true)
      const photos = await listPhotos()
      const converted = photos.map(photoToPhotosphere)
      setPhotospheres(converted)
    } catch (error: any) {
      console.error("Failed to load photos:", error)

      // Check if the error is due to unauthorized access
      if (error?.message === "Unauthorized") {
        console.log("User is not authenticated, redirecting to login page")
        window.location.href = "/"
        return
      }

      toast.error("Failed to load photos. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = (photosphere: Photosphere) => {
    setSelectedPhotosphere(photosphere)
  }

  const handleEdit = (photosphere: Photosphere) => {
    setEditingPhotosphere(photosphere)
  }

  const executeDelete = async (id: string) => {
    try {
      await deletePhoto(id)
      setPhotospheres(photospheres.filter((p) => p.id !== id))
      if (selectedPhotosphere?.id === id) {
        setSelectedPhotosphere(null)
      }
      toast.success("Photo deleted successfully")
    } catch (error) {
      console.error("Failed to delete photo:", error)
      toast.error("Failed to delete photo. Please try again.")
    }
  }

  const handleRemove = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Are you sure you want to delete this photosphere?</p>
        <div className="flex gap-2 justify-end">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id);
            }}
          >
            Delete
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    ), { duration: 5000 });
  }

  const handleUpdatePhotosphere = async (id: string, latitude: number, longitude: number) => {
    setPhotospheres(photospheres.map((p) => (p.id === id ? { ...p, latitude, longitude } : p)))
    if (selectedPhotosphere?.id === id) {
      setSelectedPhotosphere({ ...selectedPhotosphere, latitude, longitude })
    }
    setEditingPhotosphere(null)
  }

  const handleCreatePhotosphere = (newPhotosphere: Photosphere) => {
    setPhotospheres([newPhotosphere, ...photospheres])
    setIsCreateModalOpen(false)
  }

  const handleDelete = () => {
    if (selectedPhotosphere) {
      handleRemove(selectedPhotosphere.id)
    }
  }

  const handleShare = (photosphere: Photosphere) => {
    navigator.clipboard.writeText(photosphere.shareLink)
    toast.success("Share link copied to clipboard")
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading photospheres...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Drawer */}
      <PhotosphereDrawer
        photospheres={photospheres}
        onView={handleView}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onCreateNew={() => setIsCreateModalOpen(true)}
        selectedId={selectedPhotosphere?.id}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <PhotosphereViewer photosphere={selectedPhotosphere} />

        {/* Right Panel */}
        {selectedPhotosphere && (
          <PhotospherePanel
            photosphere={selectedPhotosphere}
            onDelete={handleDelete}
            onUpdate={() => handleEdit(selectedPhotosphere)}
            onShare={() => handleShare(selectedPhotosphere)}
          />
        )}
      </div>

      {/* Edit Modal */}
      {editingPhotosphere && (
        <EditModal
          photosphere={editingPhotosphere}
          onClose={() => setEditingPhotosphere(null)}
          onUpdate={handleUpdatePhotosphere}
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreatePhotosphere} />
      )}
    </div>
  )
}
