export interface Ad {
    id: number
    title: string | null
    media_type: AdMediaType
    media_url: string
    target_url: string | null
    duration_seconds: number | null
    is_active: boolean
    weight: number | null
    placement: AdPlacement[]
}

export interface CreateAdBody {
    title?: string | null
    media_type: AdMediaType
    media_url: string
    target_url?: string | null
    duration_seconds?: number | null
    is_active?: boolean
    weight?: number | null
    placement: AdPlacement[]
}

export type UpdateAdBody = Partial<CreateAdBody>

export type AdMediaType = 'image' | 'video'
export type AdPlacement = 'pre_game' | 'display'