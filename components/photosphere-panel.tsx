"use client"

import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, Calendar, Upload, Share2 } from "lucide-react"
import type { Photosphere } from "@/components/studio-layout"

type PhotospherePanelProps = {
  photosphere: Photosphere
  onDelete: () => void
  onUpdate: () => void
  onShare: () => void
}

export default function PhotospherePanel({ photosphere, onDelete, onUpdate, onShare }: PhotospherePanelProps) {
  return (
    <div className="w-72 bg-card border-l border-border p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Actions</h3>
          <div className="space-y-2">
            <Button onClick={onShare} variant="secondary" className="w-full justify-start hover:bg-secondary/40 transition-colors hover:text-secondary-foreground hover:cursor-pointer">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={onUpdate} variant="secondary" className="w-full justify-start hover:bg-secondary/40 transition-colors hover:text-secondary-foreground hover:cursor-pointer">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update
            </Button>
            <Button onClick={onDelete} variant="destructive" className="w-full justify-start hover:bg-destructive/40 transition-colors hover:text-destructive-foreground hover:cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Information</h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Capture Date</span>
              </div>
              <p className="text-sm text-foreground pl-6">{new Date(photosphere.captureDate).toLocaleDateString()}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Upload className="w-4 h-4" />
                <span>Upload Date</span>
              </div>
              <p className="text-sm text-foreground pl-6">{new Date(photosphere.uploadDate).toLocaleDateString()}</p>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Location</div>
              <p className="text-sm text-foreground font-mono">
                {photosphere.latitude.toFixed(4)}, {photosphere.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
