import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TierGate } from "../components/TierGate";
import { scores, users, getTierAccess, getTierBySlug } from "../mock";
import {
  getLeaderboard,
  getOwnEntry,
  getTopN,
  formatPoints,
  type Period,
} from "../lib/scoreboard";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Idag",
  week: "Vecka",
  all: "Totalt",
};

const highScoreTier = getTierBySlug("high-score-access");

const ScorePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [period, setPeriod] = useState<Period>("all");

  const hasHSA = Boolean(
    isAuthenticated && user && highScoreTier && getTierAccess(user.tierId, highScoreTier.id)
  );

  // Filtren (Idag/Vecka) är en High Score Access-funktion — övriga är låsta till "Totalt".
  const effectivePeriod: Period = hasHSA ? period : "all";

  const leaderboard = useMemo(
    () => getLeaderboard(scores, users, effectivePeriod),
    [effectivePeriod]
  );

  const ownEntry = user ? getOwnEntry(leaderboard, user.id) : undefined;
  const top3 = getTopN(leaderboard, 3);
  const restOfList = leaderboard.slice(3);

  function medalClass(rank: number) {
    if (rank === 1) return "row medal-gold";
    if (rank === 2) return "row medal-silver";
    if (rank === 3) return "row medal-bronze";
    return "row";
  }

  return (
    <div className="score-page">
      <div className="page-title">
        <h1>SCOREBOARD</h1>
        <p>deliver, dodge, repeat</p>
      </div>

      {/* ================= LEADERBOARD ================= */}
      <div className="card">
        <div className="card-head">
          <h2>TOPPLISTA</h2>
          <div className="tabs">
            {(["today", "week", "all"] as Period[]).map((p) => {
              const label = PERIOD_LABELS[p];
              const locked = p !== "all" && !hasHSA;
              const active = effectivePeriod === p;
              return (
                <button
                  key={p}
                  type="button"
                  className={`tab ${active ? "active" : ""} ${locked ? "locked" : ""}`}
                  disabled={locked}
                  title={locked ? "Kräver High Score Access" : undefined}
                  onClick={() => !locked && setPeriod(p)}
                >
                  {locked && <LockIcon />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Egen placering — kräver inloggning, oavsett nivå */}
        {isAuthenticated && ownEntry ? (
          <div className="own-row">
            <div className="rank">#{ownEntry.rank}</div>
            <div className="name">{ownEntry.user.username} (du)</div>
            <div className="score">{formatPoints(ownEntry.score.value)}</div>
          </div>
        ) : (
          <div className="login-cta">
            <p>Logga in eller registrera dig för att se din placering och spara framtida scores.</p>
            <button className="btn combo" type="button">
              Logga in / Registrera dig
            </button>
          </div>
        )}

        {/* Combo Pass: topp 3 */}
        <TierGate
          requiredTier="combo-pass"
          fallback={
            <div className="board">
              {top3.map((entry) => (
                <div key={entry.score.id} className={medalClass(entry.rank)}>
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">{entry.user.username}</span>
                  <span className="score">{formatPoints(entry.score.value)}</span>
                </div>
              ))}
            </div>
          }
        >
          <div className="board">
            {top3.map((entry) => (
              <div key={entry.score.id} className={medalClass(entry.rank)}>
                <span className="rank">#{entry.rank}</span>
                <span className="name">{entry.user.username}</span>
                <span className="score">{formatPoints(entry.score.value)}</span>
              </div>
            ))}
          </div>
        </TierGate>

        {/* High Score Access: hela listan */}
        <TierGate requiredTier="high-score-access">
          <div className="board">
            {restOfList.map((entry) => (
              <div
                key={entry.score.id}
                className={`row ${user && entry.user.id === user.id ? "hsa-self" : ""}`}
              >
                <span className="rank">#{entry.rank}</span>
                <span className="name">{entry.user.username}</span>
                <span className="score">{formatPoints(entry.score.value)}</span>
              </div>
            ))}
          </div>
        </TierGate>
      </div>
    </div>
  );
};

const LockIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
};

export default ScorePage;