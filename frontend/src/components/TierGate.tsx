import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { getTierAccess, getTierBySlug } from "../mock";
import type { TierSlug } from "../mock/types";

interface TierGateProps {
  requiredTier: TierSlug;
  children: ReactNode;
  // Innehållet som visas blurrat/dimmat bakom overlayn, t.ex. en förhandsvisning
  fallback?: ReactNode;
}

// Wrappar innehåll som kräver en viss nivå.
// Visar overlay med "den här sidan kräver X" + uppgraderingsknapp
// om användaren saknar rätt nivå — annars visas children rakt av.
export function TierGate({ requiredTier, children, fallback }: TierGateProps) {
  const { user, isAuthenticated } = useAuth();
  const required = getTierBySlug(requiredTier);

  if (!required) return null; // ogiltig nivå angiven, visa inget

  const hasAccess = isAuthenticated && user
    ? getTierAccess(user.tierId, required.id)
    : false;

  if (hasAccess) return <>{children}</>;

  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
      <div
        style={{
          filter: "blur(3px)",
          opacity: 0.35,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {fallback ?? children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "rgba(10,10,15,0.6)",
        }}
      >
        <p style={{ fontSize: 12, color: "#F5F5F7", textAlign: "center", padding: "0 1.5rem" }}>
          Den här sidan kräver {required.name}
        </p>
        <button
          style={{
            background: required.color,
            border: "none",
            color: "#0A0A0F",
            fontWeight: 700,
            fontSize: 12,
            padding: "8px 18px",
            borderRadius: 8,
          }}
          onClick={() => {
            // koppla till navigation, t.ex. navigate("/priser")
          }}
        >
          Uppgradera nu
        </button>
      </div>
    </div>
  );
}