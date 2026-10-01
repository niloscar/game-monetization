import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export type TierSlug = 'quarter-pass' | 'combo-pass' | 'high-score-access'

const TIER_INFO: Record<
    TierSlug,
    { level: number; name: string; color: string }
> = {
    'quarter-pass': { level: 1, name: 'Quarter Pass', color: '#8A8F98' },
    'combo-pass': { level: 2, name: 'Combo Pass', color: '#F5A623' },
    'high-score-access': {
        level: 3,
        name: 'High Score Access',
        color: '#7C5CFF'
    }
}

interface TierGateProps {
    requiredTier: TierSlug
    children: ReactNode
    fallback?: ReactNode
}

export function TierGate({ requiredTier, children, fallback }: TierGateProps) {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const required = TIER_INFO[requiredTier]

    if (!required) return null

    const hasAccess =
        isAuthenticated && user
            ? (user.tier?.level ?? 0) >= required.level
            : false

    if (hasAccess) return <>{children}</>

    return (
        <div
            style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    filter: 'blur(3px)',
                    opacity: 0.35,
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                {fallback ?? children}
            </div>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'rgba(10,10,15,0.6)'
                }}
            >
                <p
                    style={{
                        fontSize: 12,
                        color: '#F5F5F7',
                        textAlign: 'center',
                        padding: '0 1.5rem'
                    }}
                >
                    Den här sidan kräver {required.name}
                </p>
                <button
                    style={{
                        background: required.color,
                        border: 'none',
                        color: '#0A0A0F',
                        fontWeight: 700,
                        fontSize: 12,
                        padding: '8px 18px',
                        borderRadius: 8
                    }}
                    onClick={() => {navigate('/store')}}
                >
                    Uppgradera nu
                </button>
            </div>
        </div>
    )
}
