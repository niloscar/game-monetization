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

// Hur många placeringar scoreboarden visar totalt (topp 3 + luckan +
// resten). Din egen placering visas alltid oavsett rank — se ownEntry,
// som räknas ut från den ofiltrerade listan, inte den här trunkerade.
const MAX_LEADERBOARD_SIZE = 50;

// Hur många blurrade platshållarrader som visas bakom TierGate:s
// "kräver High Score Access"-overlay, oavsett hur många placeringar
// som faktiskt är dolda — annars kan luckan bli väldigt lång att
// scrolla igenom med bara en rad per dold placering.
const GAP_PLACEHOLDER_ROWS = 3;

const ScorePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [period, setPeriod] = useState<Period>("all");

  const hasHSA = Boolean(
    isAuthenticated && user && highScoreTier && getTierAccess(user.tierId, highScoreTier.id)
  );

  // Filtren (Idag/Vecka) är en High Score Access-funktion — övriga är låsta till "Totalt".
  const effectivePeriod: Period = hasHSA ? period : "all";

  // Ofiltrerad — används bara för att slå upp din egen placering, som
  // ska stämma även om du ligger utanför topp 50.
  const leaderboard = useMemo(
    () => getLeaderboard(scores, users, effectivePeriod),
    [effectivePeriod]
  );

  // Det som faktiskt visas i listan (topp 3, luckan, resten) — trunkerat
  // till MAX_LEADERBOARD_SIZE.
  const displayLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_SIZE);

  const ownEntry = user ? getOwnEntry(leaderboard, user.id) : undefined;
  const top3 = getTopN(displayLeaderboard, 3);
  const ownRank = ownEntry?.rank ?? null;

  // Platser mellan topp 3 och din egen placering — infällda, kräver High
  // Score Access för att visas. Om du själv ligger i topp 3 (eller inte är
  // inloggad) finns det ingen "lucka" att fälla in. slice klamras
  // automatiskt till displayLeaderboards längd om din placering ligger
  // utanför topp 50.
  const gapEntries = ownRank && ownRank > 4 ? displayLeaderboard.slice(3, ownRank - 1) : [];

  // Resten av listan, efter din egen placering (eller hela listan efter
  // topp 3 om du ligger i topp 3 / inte är inloggad). Tom om din
  // placering redan ligger vid eller bortom gränsen på 50.
  const afterEntries =
    ownRank && ownRank > 3 ? displayLeaderboard.slice(ownRank) : displayLeaderboard.slice(3);

  function medalClass(rank: number, isSelf: boolean) {
    const base =
      rank === 1 ? "row medal-gold" : rank === 2 ? "row medal-silver" : rank === 3 ? "row medal-bronze" : "row";
    return isSelf ? `${base} row-self` : base;
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

        {/* Combo Pass: topp 3 */}
        <TierGate
          requiredTier="combo-pass"
          fallback={
            <div className="board">
              {top3.map((entry) => {
                const isSelf = Boolean(user && entry.user.id === user.id);
                return (
                  <div key={entry.score.id} className={medalClass(entry.rank, isSelf)}>
                    <span className="rank">#{entry.rank}</span>
                    <span className="name">
                      {entry.user.username}
                      {isSelf ? " (du)" : ""}
                    </span>
                    <span className="score">{formatPoints(entry.score.value)}</span>
                  </div>
                );
              })}
            </div>
          }
        >
          <div className="board">
            {top3.map((entry) => {
              const isSelf = Boolean(user && entry.user.id === user.id);
              return (
                <div key={entry.score.id} className={medalClass(entry.rank, isSelf)}>
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">
                    {entry.user.username}
                    {isSelf ? " (du)" : ""}
                  </span>
                  <span className="score">{formatPoints(entry.score.value)}</span>
                </div>
              );
            })}
          </div>
        </TierGate>

        {/* Platser mellan topp 3 och din egen placering — infällda, kräver
            High Score Access för att visas. Fallback = ett fåtal
            blurrade platshållarrader (inga riktiga namn/poäng) bakom
            TierGate:s egen "kräver High Score Access"-overlay — en
            kompakt, infälld ruta istället för en rad per dold
            placering (som annars kan bli väldigt lång). */}
        {gapEntries.length > 0 && (
          <TierGate
            requiredTier="high-score-access"
            fallback={
              <div className="board" style={{ minHeight: 104 }}>
                {Array.from({ length: Math.min(gapEntries.length, GAP_PLACEHOLDER_ROWS) }).map(
                  (_, i) => (
                    <div key={i} className="row">
                      <span className="rank">••</span>
                      <span className="name">••••••••</span>
                      <span className="score">•••• p</span>
                    </div>
                  )
                )}
              </div>
            }
          >
            <div className="board">
              {gapEntries.map((entry) => (
                <div key={entry.score.id} className="row">
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">{entry.user.username}</span>
                  <span className="score">{formatPoints(entry.score.value)}</span>
                </div>
              ))}
            </div>
          </TierGate>
        )}

        {/* Egen placering — kräver inloggning, oavsett nivå. Visas inte om
            du redan syns i topp 3 ovanför, då skulle du synas dubbelt. */}
        {isAuthenticated && ownEntry && ownRank && ownRank > 3 ? (
          <div className="own-row">
            <div className="rank">#{ownEntry.rank}</div>
            <div className="name">{ownEntry.user.username} (du)</div>
            <div className="score">{formatPoints(ownEntry.score.value)}</div>
          </div>
        ) : !isAuthenticated ? (
          <div className="login-cta">
            <p>Logga in eller registrera dig för att se din placering och spara framtida scores.</p>
            <button className="btn combo" type="button">
              Logga in / Registrera dig
            </button>
          </div>
        ) : null}

        {/* High Score Access: resten av listan */}
        {afterEntries.length > 0 && (
          <TierGate
            requiredTier="high-score-access"
            fallback={
              // Samma kompakta platshållar-ruta som gap-sektionen ovan
              // — en handfull rader istället för en per dold placering.
              <div className="board" style={{ minHeight: 104 }}>
                {Array.from({ length: Math.min(afterEntries.length, GAP_PLACEHOLDER_ROWS) }).map(
                  (_, i) => (
                    <div key={i} className="row">
                      <span className="rank">••</span>
                      <span className="name">••••••••</span>
                      <span className="score">•••• p</span>
                    </div>
                  )
                )}
              </div>
            }
          >
            <div className="board">
              {afterEntries.map((entry) => (
                <div key={entry.score.id} className="row">
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">{entry.user.username}</span>
                  <span className="score">{formatPoints(entry.score.value)}</span>
                </div>
              ))}
            </div>
          </TierGate>
        )}
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