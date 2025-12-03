export type PhotoMetadata = {
  pose: {
    latLngPair: {
      latitude: number
      longitude: number
    }
  }
  captureTime: string // RFC3339 format
}

export type Photo = {
  photoId: {
    id: string
  }
  thumbnailUrl: string
  shareLink: string
  captureTime: string
  pose: {
    latLngPair: {
      latitude: number
      longitude: number
    }
  }
  uploadDate?: string
  mapsPublishStatus: string
  downloadUrl?: string
}

// Get the base URL for API calls
const getBaseURL = () => {
  // Use environment variable or default to current origin
  return process.env.NEXT_PUBLIC_API_URL || "/api"
}

// List all photos
export async function listPhotos(): Promise<Photo[]> {
  const response = await fetch(`${getBaseURL()}/list`)

  // Check for unauthorized access
  if (response.status === 401) {
    throw new Error("Unauthorized")
  }

  const data = await response.json()

  if (!data.photos || data.photos.length === 0) {
    return []
  }

  // Filter only published photos
  return data.photos.filter((photo: Photo) => photo.mapsPublishStatus === "PUBLISHED")
}

// Upload a new photo
export async function uploadPhoto(file: File, metadata: PhotoMetadata): Promise<Photo> {
  const json = JSON.stringify(metadata)
  const jsonBuffer = new TextEncoder().encode(json)
  const fileBuffer = await file.arrayBuffer()
  const pictureData = new Uint8Array(fileBuffer)

  // Combine JSON metadata and image data
  const reqBuffer = new Uint8Array(jsonBuffer.length + pictureData.length)
  reqBuffer.set(jsonBuffer, 0)
  reqBuffer.set(pictureData, jsonBuffer.length)

  const response = await fetch(`${getBaseURL()}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: reqBuffer,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  return response.json()
}

// Update an existing photo's metadata
export async function updatePhoto(photoId: string, metadata: PhotoMetadata): Promise<Photo> {
  const response = await fetch(`${getBaseURL()}/${photoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  })

  if (!response.ok) {
    throw new Error("Update failed")
  }

  return response.json()
}

// Delete a photo
export async function deletePhoto(photoId: string): Promise<void> {
  const response = await fetch(`${getBaseURL()}/${photoId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Delete failed")
  }
}

// Get Google OAuth URL
export async function getAuthURL(): Promise<string> {
  const response = await fetch(`${getBaseURL()}/auth`)
  return response.text()
}

// Get thumbnail URL (proxied through backend)
export function getThumbnailURL(thumbnailUrl: string): string {
  return `${getBaseURL()}/thumbnail?thumbnailUrl=${encodeURIComponent(thumbnailUrl)}`
}

// Parse EXIF date format
export function parseExifDate(exifString: string): Date {
  const [datePart, timePart] = exifString.split(" ")
  const [year, month, day] = datePart.split(":").map(Number)
  const [hour, minute, second] = timePart.split(":").map(Number)
  return new Date(year, month - 1, day, hour, minute, second)
}

// Convert DMS to decimal coordinates
export function dmsToDecimal(dmsArray: number[], ref: string): number {
  const [deg, min, sec] = dmsArray.map((v) =>
    typeof v === "object" && "numerator" in v ? (v as any).numerator / (v as any).denominator : v,
  )

  let decimal = deg + min / 60 + sec / 3600
  if (ref === "S" || ref === "W") decimal = -decimal
  return decimal
}

// Format date for display
export function formatDate(timestamp: string | Date): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}
