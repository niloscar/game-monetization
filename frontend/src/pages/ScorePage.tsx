import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TierGate } from "../components/TierGate";
import api from "../api/apiClient";
import {
  formatPoints,
  type Period,
  type ScoreboardEntry,
  type ScoreboardResponse,
} from "../lib/scoreboard";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Idag",
  week: "Vecka",
  all: "Totalt",
};

// Nivån för High Score Access i products/tiers (se seed-datan: tier.level
// 3 = High Score Access). OBS: kräver att useAuth()'s user har ett
// `tier: { level: number } | null`-fält, matchande vad GET /api/user/me
// faktiskt returnerar. Om AuthContext.tsx inte är uppdaterad för det
// ännu kommer user.tier vara undefined och hasHSA alltid falla tillbaka
// till false — hör av dig så uppdaterar jag AuthContext.tsx också.
const HIGH_SCORE_ACCESS_LEVEL = 3;

// Hur många blurrade platshållarrader som visas bakom TierGate:s
// "kräver High Score Access"-overlay, oavsett hur många placeringar som
// faktiskt är dolda — annars kan luckan bli väldigt lång att scrolla
// igenom med bara en rad per dold placering. Själva 50-gränsen sätts nu
// på backend (services/game.ts), inte här.
const GAP_PLACEHOLDER_ROWS = 3;

// Route-mönster för en spelares profilsida — matchar
// <Route path="/profile/:username" element={<ProfilePage />} /> i App.tsx.
const PROFILE_ROUTE = (username: string) => `/profile/${username}`;

const ScorePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("all");
  const [data, setData] = useState<ScoreboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasHSA = Boolean(
    isAuthenticated && user && (user.tier?.level ?? 0) >= HIGH_SCORE_ACCESS_LEVEL
  );

  // Filtren (Idag/Vecka) är en High Score Access-funktion — övriga är låsta till "Totalt".
  const effectivePeriod: Period = hasHSA ? period : "all";

  useEffect(() => {
    let cancelled = false;

    async function loadScoreboard() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await api.get<ScoreboardResponse>("/game/scoreboard", {
          params: { period: effectivePeriod },
        });
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setLoadError("Kunde inte hämta topplistan just nu.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadScoreboard();
    return () => {
      cancelled = true;
    };
  }, [effectivePeriod]);

  // scoreboard kommer redan begränsad till topp 50 från backend. own är
  // din egen placering oavsett var den ligger, uträknad server-side mot
  // den ofiltrerade listan — så rangen stämmer även utanför topp 50.
  const scoreboard = data?.scoreboard ?? [];
  const ownEntry = data?.own ?? null;
  const ownRank = ownEntry?.rank ?? null;

  const top3 = useMemo(() => scoreboard.slice(0, 3), [scoreboard]);

  // Platser mellan topp 3 och din egen placering — infällda, kräver High
  // Score Access för att visas. Baseras på entry.rank (inte array-index),
  // så det spelar ingen roll om listan skulle ha luckor.
  const gapEntries = useMemo(
    () =>
      ownRank && ownRank > 4
        ? scoreboard.filter((entry) => entry.rank > 3 && entry.rank < ownRank)
        : [],
    [scoreboard, ownRank]
  );

  // Resten av listan, efter din egen placering (eller hela listan efter
  // topp 3 om du ligger i topp 3 / inte är inloggad). Måste kolla
  // "ownRank > 3" här, inte bara att ownRank finns — annars filtrerar vi
  // på entry.rank > ownRank även när ownRank är 1–3, vilket duplicerar
  // t.ex. plats 3 (redan i top3) om man själv ligger på plats 2.
  const afterEntries = useMemo(
    () =>
      scoreboard.filter((entry) =>
        ownRank && ownRank > 3 ? entry.rank > ownRank : entry.rank > 3
      ),
    [scoreboard, ownRank]
  );

  function isSelf(entry: ScoreboardEntry) {
    return Boolean(ownEntry && entry.userId === ownEntry.userId);
  }

  function medalClass(rank: number, self: boolean) {
    const base =
      rank === 1 ? "row medal-gold" : rank === 2 ? "row medal-silver" : rank === 3 ? "row medal-bronze" : "row";
    return self ? `${base} row-self` : base;
  }

  // Klick/tangentbord-hanterare för raderna som ska gå till en spelares
  // profil. Self-raden i topp 3 är också klickbar — det är fortfarande en
  // giltig profil, bara att den råkar vara din egen.
  function goToProfile(entry: ScoreboardEntry) {
    navigate(PROFILE_ROUTE(entry.username));
  }

  function handleRowKeyDown(event: React.KeyboardEvent, entry: ScoreboardEntry) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToProfile(entry);
    }
  }

  return (
    <div className="score-page">
      <div className="page-title">
        <h1>SCOREBOARD</h1>
        <p>deliver, dodge, repeat</p>
      </div>

      {/* ================= SCOREBOARD ================= */}
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

        {loadError && <p className="error-text">{loadError}</p>}
        {isLoading && !data && !loadError && <p className="loading-text">Laddar topplistan…</p>}

        {/* Combo Pass: topp 3 */}
        <TierGate
          requiredTier="combo-pass"
          fallback={
            <div className="board">
              {top3.map((entry) => (
                <div key={entry.userId} className={medalClass(entry.rank, isSelf(entry))}>
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">
                    {entry.username}
                    {isSelf(entry) ? " (du)" : ""}
                  </span>
                  <span className="score">{formatPoints(entry.score)}</span>
                </div>
              ))}
            </div>
          }
        >
          <div className="board">
            {top3.map((entry) => (
              <div
                key={entry.userId}
                className={`${medalClass(entry.rank, isSelf(entry))} row-clickable`}
                role="button"
                tabIndex={0}
                onClick={() => goToProfile(entry)}
                onKeyDown={(e) => handleRowKeyDown(e, entry)}
              >
                <span className="rank">#{entry.rank}</span>
                <span className="name">
                  {entry.username}
                  {isSelf(entry) ? " (du)" : ""}
                </span>
                <span className="score">{formatPoints(entry.score)}</span>
              </div>
            ))}
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
                <div
                  key={entry.userId}
                  className="row row-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => goToProfile(entry)}
                  onKeyDown={(e) => handleRowKeyDown(e, entry)}
                >
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">{entry.username}</span>
                  <span className="score">{formatPoints(entry.score)}</span>
                </div>
              ))}
            </div>
          </TierGate>
        )}

        {/* Egen placering — kräver inloggning, oavsett nivå. Visas inte om
            du redan syns i topp 3 ovanför, då skulle du synas dubbelt.
            Inte klickbar — det är redan du, ingen anledning att navigera
            till din egen profil härifrån. */}
        {isAuthenticated && ownEntry && ownRank && ownRank > 3 ? (
          <div className="own-row">
            <div className="rank">#{ownEntry.rank}</div>
            <div className="name">{ownEntry.username} (du)</div>
            <div className="score">{formatPoints(ownEntry.score)}</div>
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
                <div
                  key={entry.userId}
                  className="row row-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => goToProfile(entry)}
                  onKeyDown={(e) => handleRowKeyDown(e, entry)}
                >
                  <span className="rank">#{entry.rank}</span>
                  <span className="name">{entry.username}</span>
                  <span className="score">{formatPoints(entry.score)}</span>
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