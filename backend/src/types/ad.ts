export interface Ad {
    id: number
    type: 'video' | 'banner'
    url: string
    is_active: boolean
    title: string | null
    weight: number | null
}
export interface CreateAdBody {
    type: 'video' | 'banner'
    url: string
    is_active?: boolean
    title?: string | null
    weight?: number | null
}

export type UpdateAdBody = Partial<CreateAdBody>