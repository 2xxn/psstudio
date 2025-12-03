export interface PhotoListResponse {
    photos: Photo[]
}

export interface Photo {
    photoId: PhotoId
    pose: Pose
    captureTime: string
    thumbnailUrl: string
    viewCount: string
    shareLink: string
    mapsPublishStatus: string
    uploadTime: string
    connections?: Connection[]
    places?: Place[]
    downloadUrl?: string
}

export interface PhotoId {
    id: string
}

export interface Pose {
    latLngPair: LatLngPair
    altitude?: string
    heading: any
    level?: Level
    pitch?: string
    roll?: string
}

export interface LatLngPair {
    latitude?: number
    longitude?: number
}

export interface Level { }

export interface Connection {
    target: Target
}

export interface Target {
    id: string
}

export interface Place {
    placeId: string
    name: string
    languageCode: string
}
