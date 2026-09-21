export interface User {
    id: string
    username: string
    email: string
    role: UserRole
    tier: Tier | null
    createdAt: string
}

/* --------------------------------------------------
 * What the controller layer expects to receive
 * -------------------------------------------------- */
export interface CreateUserBody {
    username: string
    email: string
    password: string
}

export interface UpdateUserBody {
    username?: string
    email?: string
    password?: string
    roleId?: number
    tierId?: number
}

export interface UpdateMeBody {
    username?: string
    email?: string
    password?: string
}

export interface UpdateUserPasswordBody {
    oldPassword: string
    newPassword: string
}

/* --------------------------------------------------
 * What the service layer expects to receive
 * -------------------------------------------------- */
export interface CreateUserData {
    username: string
    email: string
    passwordHash: string
    roleId: number
}

export interface UpdateUserData {
    username?: string
    email?: string
    passwordHash?: string
    roleId?: number
    tierId?: number
}

export interface UpdateMeData {
    username?: string
    email?: string
    passwordHash?: string
}

export interface UpdateUserPasswordData {
    passwordHash: string
}


interface UserRole {
    id: number
    name: string
    description: string | null
}

interface Tier {
    id: number
    name: string
    description: string | null
    level: number
}