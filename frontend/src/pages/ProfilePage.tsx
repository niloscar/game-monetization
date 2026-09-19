import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TierGate } from "../components/TierGate";
import { users, scores, tiers } from "../mock";
import {
  findUserByUsername,
  getProfileStats,
  getProfileRank,
  getProfileIconKey,
  formatPlaytime,
} from "../lib/profile";
import { formatPoints } from "../lib/scoreboard";
import { getAchievements, countUnlocked } from "../lib/achievements";

import quarterIcon from "../assets/quarter-icon.png";
import comboIcon from "../assets/combo-icon.png";
import highscoreIcon from "../assets/highscore-icon.png";
import adminIcon from "../assets/admin-icon.png";

const PROFILE_ICONS = {
  quarter: quarterIcon,
  combo: comboIcon,
  highscore: highscoreIcon,
  admin: adminIcon,
};

const tierSlugById = new Map(tiers.map((t) => [t.id, t.slug]));
const tierNameById = new Map(tiers.map((t) => [t.id, t.name]));

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser, logout, updateProfile } = useAuth();

  const isOwnProfile = !username || username === loggedInUser?.username;
  const viewedUser = isOwnProfile ? loggedInUser : findUserByUsername(users, username!);

  // Stängt som standard så sidan inte blir onödigt lång — kortet visar
  // ändå "x/9 upplåsta" i card-head utan att expanderas.
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // ---- Inline-redigering av KONTO-kortet (bara på egen profil) ----
  const [isEditing, setIsEditing] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPasswordConfirm, setFormPasswordConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function startEditing() {
    setFormUsername(loggedInUser?.username ?? "");
    setFormEmail(loggedInUser?.email ?? "");
    setFormPassword("");
    setFormPasswordConfirm("");
    setFormError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setFormError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedUsername = formUsername.trim();
    const trimmedEmail = formEmail.trim();

    if (!trimmedUsername || !trimmedEmail) {
      setFormError("Användarnamn och e-post kan inte vara tomma.");
      return;
    }
    if (formPassword && formPassword !== formPasswordConfirm) {
      setFormError("Lösenorden matchar inte.");
      return;
    }
    if (formPassword && formPassword.length < 8) {
      setFormError("Lösenordet måste vara minst 8 tecken.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        username: trimmedUsername,
        email: trimmedEmail,
        ...(formPassword ? { password: formPassword } : {}),
      });
      setIsEditing(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kunde inte spara ändringarna.");
    } finally {
      setIsSaving(false);
    }
  }

  const stats = useMemo(
    () => (viewedUser ? getProfileStats(scores, viewedUser.id) : null),
    [viewedUser]
  );
  const rank = useMemo(
    () => (viewedUser ? getProfileRank(scores, users, viewedUser.id) : null),
    [viewedUser]
  );
  const achievements = useMemo(
    () => (viewedUser ? getAchievements(scores, viewedUser.id, rank) : []),
    [viewedUser, rank]
  );

  // Inte inloggad och inget username i URL:en — kan inte visa "egen profil".
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
    );
  }

  // Publik profil, men användarnamnet finns inte.
  if (!viewedUser) {
    return (
      <div className="score-page">
        <div className="card">
          <p>Hittar ingen användare med det namnet.</p>
          <Link to="/scoreboard" className="btn combo">
            Tillbaka till scoreboard
          </Link>
        </div>
      </div>
    );
  }

  const iconKey = getProfileIconKey(viewedUser, tierSlugById);
  const tierName = tierNameById.get(viewedUser.tierId) ?? "Okänd nivå";

  return (
    <div className="score-page">
      {!isOwnProfile && (
        <Link to="/scoreboard" className="back-link">
          ← Tillbaka till scoreboard
        </Link>
      )}

      {/* ================= PROFILHUVUD ================= */}
      <div className="card profile-head">
        <img src={PROFILE_ICONS[iconKey]} alt="" className="profile-avatar" />
        <div className="profile-head-info">
          <h1>{viewedUser.username}</h1>
          <span className={`tier-badge tier-badge-${iconKey}`}>{tierName}</span>
          <p className="profile-meta">
            Medlem sedan {new Date(viewedUser.createdAt).toLocaleDateString("sv-SE")}
          </p>
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
            <div className="value">{rank ? `#${rank}` : "—"}</div>
          </div>
          <div className="stat-tile">
            <div className="label">Bästa resultat</div>
            <div className="value">
              {stats?.bestScore != null ? formatPoints(stats.bestScore) : "—"}
            </div>
          </div>

          {/* Snittresultat, antal omgångar och speltid: fritt för alla på
              egen profil, men kräver High Score Access att se på andras. */}
          {isOwnProfile ? (
            <>
              <div className="stat-tile">
                <div className="label">Snittresultat</div>
                <div className="value">
                  {stats?.averageScore != null ? formatPoints(stats.averageScore) : "—"}
                </div>
              </div>
              <div className="stat-tile">
                <div className="label">Omgångar spelade</div>
                <div className="value">{stats?.gamesPlayed ?? 0}</div>
              </div>
              <div className="stat-tile">
                <div className="label">Speltid, totalt</div>
                <div className="value">
                  {stats ? formatPlaytime(stats.totalPlaytimeSeconds) : "—"}
                </div>
              </div>
            </>
          ) : (
            <TierGate
              requiredTier="high-score-access"
              fallback={
                <>
                  <div className="stat-tile">
                    <div className="label">Snittresultat</div>
                    <div className="value">—</div>
                  </div>
                  <div className="stat-tile">
                    <div className="label">Omgångar spelade</div>
                    <div className="value">—</div>
                  </div>
                  <div className="stat-tile">
                    <div className="label">Speltid, totalt</div>
                    <div className="value">—</div>
                  </div>
                </>
              }
            >
              <div className="stat-tile">
                <div className="label">Snittresultat</div>
                <div className="value">
                  {stats?.averageScore != null ? formatPoints(stats.averageScore) : "—"}
                </div>
              </div>
              <div className="stat-tile">
                <div className="label">Omgångar spelade</div>
                <div className="value">{stats?.gamesPlayed ?? 0}</div>
              </div>
              <div className="stat-tile">
                <div className="label">Speltid, totalt</div>
                <div className="value">
                  {stats ? formatPlaytime(stats.totalPlaytimeSeconds) : "—"}
                </div>
              </div>
            </TierGate>
          )}
        </div>
        {!isOwnProfile && (
          <p className="profile-meta">Detaljerad statistik kräver High Score Access.</p>
        )}
      </div>

      {/* ================= PRESTATIONER (infällbart) ================= */}
      <div className="card">
        <button
          type="button"
          className="card-head achievement-toggle"
          onClick={() => setIsAchievementsOpen((open) => !open)}
          aria-expanded={isAchievementsOpen}
        >
          <h2>PRESTATIONER</h2>
          <span className="achievement-count">
            {countUnlocked(achievements)}/{achievements.length} upplåsta
            <span className={`chevron${isAchievementsOpen ? " open" : ""}`}>▾</span>
          </span>
        </button>
        {isAchievementsOpen && (
          <div className="achievement-grid">
            {achievements.map(({ achievement, unlocked }) => (
              <div
                key={achievement.id}
                className={`achievement-tile${unlocked ? "" : " locked"}`}
                title={achievement.description}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-text">
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-desc">{achievement.description}</span>
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
            <form className="profile-edit-form" onSubmit={handleSave}>
              <label className="field">
                <span className="field-label">Användarnamn</span>
                <input
                  type="text"
                  className="field-input"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
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
                  onChange={(e) => setFormEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">Nytt lösenord</span>
                <input
                  type="password"
                  className="field-input"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Lämna tomt för att behålla nuvarande"
                />
              </label>
              {formPassword && (
                <label className="field">
                  <span className="field-label">Bekräfta nytt lösenord</span>
                  <input
                    type="password"
                    className="field-input"
                    value={formPasswordConfirm}
                    onChange={(e) => setFormPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </label>
              )}

              {formError && <p className="field-error">{formError}</p>}

              <div className="profile-actions">
                <button type="submit" className="btn combo" disabled={isSaving}>
                  {isSaving ? "Sparar…" : "Spara"}
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
                  <strong>Användarnamn:</strong> {loggedInUser?.username}
                </p>
                <p>
                  <strong>E-post:</strong> {loggedInUser?.email}
                </p>
                <p>
                  <strong>Nivå:</strong> {tierName}
                </p>
              </div>
              <div className="profile-actions">
                <button type="button" className="btn combo" onClick={startEditing}>
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
            <button type="button" className="btn btn-logout" onClick={() => logout()}>
              Logga ut
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;