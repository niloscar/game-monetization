import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TierGate } from '../components/TierGate'
import api from '../api/apiClient'
import {
    fetchMyScores,
    fetchScoresForUser,
    getProfileStats,
    findRankInScoreboard,
    findIdentityInScoreboard,
    getProfileIconKey
} from '../lib/profile'
import type { ProfileIdentity, ProfileStats, UserScore } from '../lib/profile'
import { formatPoints, type ScoreboardResponse } from '../lib/scoreboard'
import { getAchievements, countUnlocked } from '../lib/achievements'

import quarterIcon from '../assets/quarter-icon.png'
import comboIcon from '../assets/combo-icon.png'
import highscoreIcon from '../assets/highscore-icon.png'
import adminIcon from '../assets/admin-icon.png'

const PROFILE_ICONS = {
    quarter: quarterIcon,
    combo: comboIcon,
    highscore: highscoreIcon,
    admin: adminIcon
}

const ProfilePage = () => {
    const { username } = useParams()
    const { user: loggedInUser, logout, updateProfile } = useAuth()

    const isOwnProfile = !username || username === loggedInUser?.username

    const [identity, setIdentity] = useState<ProfileIdentity | null>(null)
    const [stats, setStats] = useState<ProfileStats | null>(null)
    const [rank, setRank] = useState<number | null>(null)
    const [scores, setScores] = useState<UserScore[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState(false)

    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false)

    // ---- Inline-redigering av KONTO-kortet (bara på egen profil) ----
    const [isEditing, setIsEditing] = useState(false)
    const [formUsername, setFormUsername] = useState('')
    const [formEmail, setFormEmail] = useState('')
    const [formPassword, setFormPassword] = useState('')
    const [formPasswordConfirm, setFormPasswordConfirm] = useState('')
    const [formError, setFormError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    function startEditing() {
        setFormUsername(loggedInUser?.username ?? '')
        setFormEmail(loggedInUser?.email ?? '')
        setFormPassword('')
        setFormPasswordConfirm('')
        setFormError(null)
        setIsEditing(true)
    }

    function cancelEditing() {
        setIsEditing(false)
        setFormError(null)
    }

    async function handleSave(e: FormEvent) {
        e.preventDefault()
        setFormError(null)

        const trimmedUsername = formUsername.trim()
        const trimmedEmail = formEmail.trim()

        if (!trimmedUsername || !trimmedEmail) {
            setFormError('Användarnamn och e-post kan inte vara tomma.')
            return
        }
        if (formPassword && formPassword !== formPasswordConfirm) {
            setFormError('Lösenorden matchar inte.')
            return
        }
        if (formPassword && formPassword.length < 8) {
            setFormError('Lösenordet måste vara minst 8 tecken.')
            return
        }

        setIsSaving(true)
        try {
            await updateProfile({
                username: trimmedUsername,
                email: trimmedEmail,
                ...(formPassword ? { password: formPassword } : {})
            })
            setIsEditing(false)
        } catch (err) {
            setFormError(
                err instanceof Error
                    ? err.message
                    : 'Kunde inte spara ändringarna.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    // ---- Hämtning av profildata mot riktiga API:et ----
    useEffect(() => {
        let cancelled = false

        async function load() {
            setIsLoading(true)
            setLoadError(null)
            setNotFound(false)

            try {
                if (isOwnProfile) {
                    if (!loggedInUser) {
                        return
                    }

                    const [myScores, board] = await Promise.all([
                        fetchMyScores(),
                        api.get<ScoreboardResponse>('/game/scoreboard', {
                            params: { period: 'all' }
                        })
                    ])

                    if (cancelled) return

                    setIdentity({
                        userId: loggedInUser.id,
                        username: loggedInUser.username,
                        email: loggedInUser.email,
                        role: loggedInUser.role,
                        tier: loggedInUser.tier,
                        createdAt: loggedInUser.createdAt
                    })
                    setStats(getProfileStats(myScores))
                    setScores(myScores)
                    setRank(
                        board.data.own?.rank ??
                            findRankInScoreboard(
                                board.data.scoreboard,
                                loggedInUser.id
                            )
                    )
                } else {
                    const board = await api.get<ScoreboardResponse>(
                        '/game/scoreboard',
                        {
                            params: { period: 'all' }
                        }
                    )
                    if (cancelled) return

                    const found = findIdentityInScoreboard(
                        board.data.scoreboard,
                        username!
                    )
                    if (!found) {
                        setNotFound(true)
                        return
                    }

                    setIdentity({
                        userId: found.userId,
                        username: found.username
                    })
                    setRank(
                        findRankInScoreboard(
                            board.data.scoreboard,
                            found.userId
                        )
                    )

                    try {
                        const otherScores = await fetchScoresForUser(
                            found.userId
                        )
                        if (!cancelled) {
                            setStats(getProfileStats(otherScores))
                            setScores(otherScores)
                        }
                    } catch {
                        if (!cancelled) {
                            setStats({
                                bestScore: found.bestScoreFromBoard,
                                averageScore: null,
                                gamesPlayed: 0
                            })
                            setScores([])
                        }
                    }
                }
            } catch {
                if (!cancelled)
                    setLoadError('Kunde inte hämta profildata just nu.')
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [isOwnProfile, username, loggedInUser])

    if (isOwnProfile && !loggedInUser) {
        return (
            <div className="score-page">
                <div className="card login-cta">
                    <p>Logga in för att se din profil.</p>
                    <Link to="/login" className="btn combo">
                        Logga in
                    </Link>
                </div>
            </div>
        )
    }

    if (isLoading && !identity && !loadError && !notFound) {
        return (
            <div className="score-page">
                <div className="card">
                    <p className="loading-text">Laddar profil…</p>
                </div>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="score-page">
                <div className="card">
                    <p>Hittar ingen användare med det namnet.</p>
                    <Link to="/scoreboard" className="btn combo">
                        Tillbaka till scoreboard
                    </Link>
                </div>
            </div>
        )
    }

    if (loadError && !identity) {
        return (
            <div className="score-page">
                <div className="card">
                    <p className="error-text">{loadError}</p>
                </div>
            </div>
        )
    }

    const achievements = identity
        ? getAchievements(scores, identity.userId, rank)
        : []

    if (!identity) return null

    const iconKey = getProfileIconKey(identity)
    const tierName = identity.tier?.name ?? 'Okänd nivå'

    return (
        <div className="score-page">
            {!isOwnProfile && (
                <Link to="/scoreboard" className="back-link">
                    ← Tillbaka till scoreboard
                </Link>
            )}

            {/* ================= PROFILHUVUD ================= */}
            <div className="card profile-head">
                <img
                    src={PROFILE_ICONS[iconKey]}
                    alt=""
                    className="profile-avatar"
                />
                <div className="profile-head-info">
                    <h1>{identity.username}</h1>
                    <span className={`tier-badge tier-badge-${iconKey}`}>
                        {tierName}
                    </span>
                    {identity.createdAt ? (
                        <p className="profile-meta">
                            Medlem sedan{' '}
                            {new Date(identity.createdAt).toLocaleDateString(
                                'sv-SE'
                            )}
                        </p>
                    ) : (
                        <p className="profile-meta profile-meta-unknown">
                            Nivå och medlemsdatum kräver att en publik
                            profil-endpoint finns.
                        </p>
                    )}
                </div>
            </div>

            {/* ================= STATISTIK ================= */}
            <div className="card">
                <div className="card-head">
                    <h2>STATISTIK</h2>
                </div>
                <div className="stat-grid">
                    <div className="stat-tile">
                        <div className="label">Placering</div>
                        <div className="value">{rank ? `#${rank}` : '—'}</div>
                    </div>
                    <div className="stat-tile">
                        <div className="label">Bästa resultat</div>
                        <div className="value">
                            {stats?.bestScore != null
                                ? formatPoints(stats.bestScore)
                                : '—'}
                        </div>
                    </div>

                    {/* Snittresultat och antal omgångar: fritt för alla på egen
              profil, men kräver High Score Access att se på andras.
              OBS: "Speltid, totalt" är borttagen härifrån — riktiga
              scores-tabellen har ingen playtime-kolumn, se lib/profile.ts. */}
                    {isOwnProfile ? (
                        <>
                            <div className="stat-tile">
                                <div className="label">Snittresultat</div>
                                <div className="value">
                                    {stats?.averageScore != null
                                        ? formatPoints(stats.averageScore)
                                        : '—'}
                                </div>
                            </div>
                            <div className="stat-tile">
                                <div className="label">Omgångar spelade</div>
                                <div className="value">
                                    {stats?.gamesPlayed ?? 0}
                                </div>
                            </div>
                        </>
                    ) : (
                        <TierGate
                            requiredTier="high-score-access"
                            fallback={
                                <>
                                    <div className="stat-tile">
                                        <div className="label">
                                            Snittresultat
                                        </div>
                                        <div className="value">—</div>
                                    </div>
                                    <div className="stat-tile">
                                        <div className="label">
                                            Omgångar spelade
                                        </div>
                                        <div className="value">—</div>
                                    </div>
                                </>
                            }
                        >
                            <div className="stat-tile">
                                <div className="label">Snittresultat</div>
                                <div className="value">
                                    {stats?.averageScore != null
                                        ? formatPoints(stats.averageScore)
                                        : '—'}
                                </div>
                            </div>
                            <div className="stat-tile">
                                <div className="label">Omgångar spelade</div>
                                <div className="value">
                                    {stats?.gamesPlayed ?? 0}
                                </div>
                            </div>
                        </TierGate>
                    )}
                </div>
                {!isOwnProfile && (
                    <p className="profile-meta">
                        Detaljerad statistik kräver High Score Access.
                    </p>
                )}
            </div>

            {/* ================= PRESTATIONER (infällbart) =================
          3 av 9 ursprungliga prestationer (hour-in/marathon/explorer)
          är borttagna i lib/achievements.ts — de byggde på
          playtimeSeconds/track som inte finns i riktiga scores-tabellen.
          Resten (antal omgångar + placeringsbaserade) räknas på riktig
          data. */}
            <div className="card">
                <button
                    type="button"
                    className="card-head achievement-toggle"
                    onClick={() => setIsAchievementsOpen((open) => !open)}
                    aria-expanded={isAchievementsOpen}
                >
                    <h2>PRESTATIONER</h2>
                    <span className="achievement-count">
                        {countUnlocked(achievements)}/{achievements.length}{' '}
                        upplåsta
                        <span
                            className={`chevron${isAchievementsOpen ? ' open' : ''}`}
                        >
                            ▾
                        </span>
                    </span>
                </button>
                {isAchievementsOpen && (
                    <div className="achievement-grid">
                        {achievements.map(({ achievement, unlocked }) => (
                            <div
                                key={achievement.id}
                                className={`achievement-tile${unlocked ? '' : ' locked'}`}
                                title={achievement.description}
                            >
                                <span className="achievement-icon">
                                    {achievement.icon}
                                </span>
                                <div className="achievement-text">
                                    <span className="achievement-name">
                                        {achievement.name}
                                    </span>
                                    <span className="achievement-desc">
                                        {achievement.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= EGNA INSTÄLLNINGAR (bara egen profil) ================= */}
            {isOwnProfile && (
                <div className="card">
                    <div className="card-head">
                        <h2>KONTO</h2>
                    </div>

                    {isEditing ? (
                        <form
                            className="profile-edit-form"
                            onSubmit={handleSave}
                        >
                            <label className="field">
                                <span className="field-label">
                                    Användarnamn
                                </span>
                                <input
                                    type="text"
                                    className="field-input"
                                    value={formUsername}
                                    onChange={(e) =>
                                        setFormUsername(e.target.value)
                                    }
                                    autoComplete="username"
                                    required
                                />
                            </label>
                            <label className="field">
                                <span className="field-label">E-post</span>
                                <input
                                    type="email"
                                    className="field-input"
                                    value={formEmail}
                                    onChange={(e) =>
                                        setFormEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />
                            </label>
                            <label className="field">
                                <span className="field-label">
                                    Nytt lösenord
                                </span>
                                <input
                                    type="password"
                                    className="field-input"
                                    value={formPassword}
                                    onChange={(e) =>
                                        setFormPassword(e.target.value)
                                    }
                                    autoComplete="new-password"
                                    placeholder="Lämna tomt för att behålla nuvarande"
                                />
                            </label>
                            {formPassword && (
                                <label className="field">
                                    <span className="field-label">
                                        Bekräfta nytt lösenord
                                    </span>
                                    <input
                                        type="password"
                                        className="field-input"
                                        value={formPasswordConfirm}
                                        onChange={(e) =>
                                            setFormPasswordConfirm(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                    />
                                </label>
                            )}

                            {formError && (
                                <p className="field-error">{formError}</p>
                            )}

                            <div className="profile-actions">
                                <button
                                    type="submit"
                                    className="btn combo"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Sparar…' : 'Spara'}
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={cancelEditing}
                                    disabled={isSaving}
                                >
                                    Avbryt
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="profile-account-info">
                                <p>
                                    <strong>Användarnamn:</strong>{' '}
                                    {loggedInUser?.username}
                                </p>
                                <p>
                                    <strong>E-post:</strong>{' '}
                                    {loggedInUser?.email}
                                </p>
                                <p>
                                    <strong>Nivå:</strong> {tierName}
                                </p>
                            </div>
                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn combo"
                                    onClick={startEditing}
                                >
                                    Redigera profil
                                </button>
                                <Link to="/store" className="btn hsa">
                                    Uppgradera nivå
                                </Link>
                                <Link to="/receipt" className="btn">
                                    Kvitton
                                </Link>
                            </div>
                        </>
                    )}

                    <div className="profile-logout">
                        <button
                            type="button"
                            className="btn btn-logout"
                            onClick={() => logout()}
                        >
                            Logga ut
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage
