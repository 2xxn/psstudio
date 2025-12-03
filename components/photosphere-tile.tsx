"use client"

import { useState } from "react"
import { Eye, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Photosphere } from "@/components/studio-layout"
import Image from "next/image"
import { getThumbnailURL } from "@/lib/api"

type PhotosphereTileProps = {
  photosphere: Photosphere
  onView: (photosphere: Photosphere) => void
  onEdit: (photosphere: Photosphere) => void
  onRemove: (id: string) => void
  isSelected: boolean
}

export default function PhotosphereTile({ photosphere, onView, onEdit, onRemove, isSelected }: PhotosphereTileProps) {
  const [isHovered, setIsHovered] = useState(false)

  const thumbnailUrl = photosphere.thumbnailUrl // getThumbnailURL(photosphere.thumbnailUrl)

  return (
    <div
      className={`relative w-full aspect-[2/1] rounded-lg overflow-hidden group cursor-pointer transition-all ${isSelected ? "ring-2 ring-sidebar-primary" : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(photosphere)}
    >
      <Image src={thumbnailUrl || "/placeholder.svg"} alt={photosphere.name} fill className="object-cover" />

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isHovered ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-9 w-9 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onView(photosphere)
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 w-9 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(photosphere)
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-9 w-9 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(photosphere.id)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Name Label */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-xs font-medium text-white truncate">{photosphere.name}</p>
      </div>
    </div>
  )
}
