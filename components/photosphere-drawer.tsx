"use client"

import { Plus } from "lucide-react"
import PhotosphereTile from "@/components/photosphere-tile"
import type { Photosphere } from "@/components/studio-layout"
import Image from "next/image"

type PhotosphereDrawerProps = {
  photospheres: Photosphere[]
  onView: (photosphere: Photosphere) => void
  onEdit: (photosphere: Photosphere) => void
  onRemove: (id: string) => void
  onCreateNew: () => void
  selectedId?: string
}

export default function PhotosphereDrawer({
  photospheres,
  onView,
  onEdit,
  onRemove,
  onCreateNew,
  selectedId,
}: PhotosphereDrawerProps) {
  return (
    <div className="w-52 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Image
              src="/favicon.png"
              alt="Photosphere Studio"
              width={48}
              height={48}
            />
          </div>
          <h1 className="text-xl font-semibold text-sidebar-foreground">PSStudio</h1>
        </div>
      </div>

      {/* Photosphere Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {/* Create New Tile */}
          <button
            onClick={onCreateNew}
            className="w-full aspect-[2/1] rounded-lg border-2 border-dashed border-sidebar-border hover:border-sidebar-primary hover:bg-sidebar-accent/50 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-sidebar-accent group-hover:bg-sidebar-primary/10 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-sidebar-foreground group-hover:text-sidebar-primary transition-colors" />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
              Create New
            </span>
          </button>

          {/* Photosphere Tiles */}
          {photospheres.map((photosphere) => (
            <PhotosphereTile
              key={photosphere.id}
              photosphere={photosphere}
              onView={onView}
              onEdit={onEdit}
              onRemove={onRemove}
              isSelected={photosphere.id === selectedId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
