export interface Ad {
    id: number
    type: 'video' | 'banner'
    url: string
    is_active: boolean
}

export type CreateAdBody = Omit<Ad, 'id' | 'is_active'> & {
    is_active?: boolean
}

export type UpdateAdBody = Partial<CreateAdBody>