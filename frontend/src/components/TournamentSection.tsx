import { EVENTS } from "../utils/helper";

interface Player {
  name: string;
  country: string;
  countryCode?: string; // optional — falls back to placeholder flag
  serving?: boolean;
}

interface SetScore {
  p1: number;
  p2: number;
  current?: boolean;
  retired?: boolean; // prev/greyed out set
}

interface Match {
  id: string;
  event: string;
  round: string;
  status: "live" | "ended" | "scheduled";
  players: [Player, Player];
  sets: SetScore[];
  elapsed?: string;
}

interface Tournament {
  id: string;
  name: string;
  countryCode?: string; // optional — falls back to placeholder flag
  series: string;
  level: string;
  status: string;
}

interface TournamentSectionProps {
  tournament: Tournament;
  matches: Match[];
}

// flagcdn.com codes — safe fallback if countryCode is missing
function flagUrl(code?: string) {
  if (!code) return "https://flagcdn.com/w40/un.png"; // UN flag as placeholder
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

function ScoreBox({
  value,
  state,
}: {
  value: number;
  state: "won" | "lost" | "current" | "prev";
}) {
  const styles: Record<string, React.CSSProperties> = {
    won:     { background: "var(--cb-nav, #2c1f14)", color: "#fff" },
    lost:    { background: "#f0ede8", color: "var(--cb-muted2, #b5b0a6)" },
    current: {
      background: "var(--cb-amber-bg, #fdf3e3)",
      color: "var(--cb-amber, #d4840a)",
      border: "1px solid rgba(212,132,10,0.25)",
    },
    prev: {
      background: "transparent",
      color: "var(--cb-muted2, #b5b0a6)",
      opacity: 0.6,
      fontSize: 10,
    },
  };

  return (
    <div
      className="flex h-7 w-7 items-center justify-center rounded"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        fontWeight: 600,
        ...styles[state],
      }}
    >
      {value}
    </div>
  );
}

function ServingDot() {
  return (
    <span
      className="ml-1.5 inline-block h-[5px] w-[5px] rounded-full bg-amber-400 align-middle"
      style={{ animation: "cb-blink 1.4s infinite" }}
    />
  );
}

function LiveBadge() {
  return (
    <div
      className="flex items-center gap-[5px] rounded-[3px] px-[9px] py-1 text-[9px] font-semibold uppercase tracking-[0.1em]"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: "var(--cb-red, #c0392b)",
        background: "var(--cb-red-bg, #fdf0ee)",
        border: "1px solid rgba(192,57,43,0.2)",
      }}
    >
      <ServingDot />
      live
    </div>
  );
}

function EndedBadge() {
  return (
    <div
      className="rounded-[3px] px-[9px] py-1 text-[9px] font-medium uppercase tracking-[0.1em]"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: "var(--cb-muted2, #b5b0a6)",
        background: "#f5f3ef",
        border: "1px solid var(--cb-border, #e2ddd4)",
      }}
    >
      ended
    </div>
  );
}

export default function TournamentSection({
  tournament,
  matches,
}: TournamentSectionProps) {
  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        background: "var(--cb-card, #fff)",
        border: "1px solid var(--cb-border, #e2ddd4)",
      }}
    >
      {/* ── TOURNAMENT HEADER ── */}
      <div
        className="flex items-center gap-3 px-[18px] py-[14px]"
        style={{ background: "var(--cb-nav, #2c1f14)" }}
      >
        <img
          src={flagUrl(tournament.countryCode)}
          alt={tournament.name}
          className="h-[26px] w-9 rounded-[3px] object-cover"
          style={{ border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}
        />
        <div>
          <div
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em", fontSize: 18, lineHeight: 1.1, color: "#ffffff" }}
          >
            {tournament.name}
          </div>
          <div
            style={{ marginTop: 2, fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)" }}
          >
            {tournament.series} · {tournament.level}
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto", flexShrink: 0,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "#f0a030",
            border: "1px solid rgba(240,160,48,0.35)",
            borderRadius: 3, padding: "3px 10px",
          }}
        >
          {matches[0]?.round ?? ""}
        </div>
      </div>

      {/* ── MATCH ROWS ── */}
      {matches.map((match) => {
        const [p1, p2] = match.players;
        const p1WonSets = match.sets.filter((s) => !s.current && s.p1 > s.p2).length;
        const p2WonSets = match.sets.filter((s) => !s.current && s.p2 > s.p1).length;
        const p1Winning = p1WonSets >= p2WonSets;

        return (
          <div
            key={match.id}
            className="group relative grid cursor-pointer items-center gap-[14px] border-t px-[18px] py-[14px] transition-colors duration-[120ms]"
            style={{
              gridTemplateColumns: "72px 1fr auto 104px",
              borderColor: "var(--cb-border, #e2ddd4)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#faf9f7")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {/* amber left stripe on hover */}
            <span
              className="pointer-events-none absolute left-0 top-0 h-full w-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: "#f0a030" }}
            />

            {/* DISCIPLINE */}
            <div className="text-center">
              <div
                className="text-[9px] font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--cb-muted2, #b5b0a6)" }}
              >
                {match.round}
              </div>
              <div
                className="text-[20px] leading-[1.1]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: "var(--cb-amber, #d4840a)",
                  letterSpacing: "0.05em",
                }}
              >
                {EVENTS[match.event as keyof typeof EVENTS] ?? match.event}
              </div>
            </div>

            {/* PLAYERS */}
            <div className="flex flex-col gap-2.5">
              {[p1, p2].map((player, pi) => {
                const isWinner = pi === 0 ? p1Winning : !p1Winning;
                return (
                  <div key={pi} className="flex items-center gap-2.5">
                    <img
                      src={flagUrl(player.countryCode)}
                      alt={player.country}
                      className="h-5 w-7 rounded-[2px] object-cover"
                      style={{
                        flexShrink: 0,
                        border: "1px solid var(--cb-border, #e2ddd4)",
                      }}
                    />
                    <div className="flex flex-col">
                      <span
                        className="text-[13px] leading-tight"
                        style={{
                          fontWeight: isWinner ? 500 : 400,
                          color: isWinner
                            ? "var(--cb-ink, #0b0d14)"
                            : "var(--cb-muted2, #b5b0a6)",
                        }}
                      >
                        {player.name}
                        {player.serving && <ServingDot />}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--cb-muted2, #b5b0a6)" }}
                      >
                        {player.country}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SCORES */}
            <div className="flex flex-col items-end gap-2.5">
              {match.sets.map((set, si) => {
                const p1State = set.current
                  ? "current"
                  : set.retired
                  ? "prev"
                  : set.p1 > set.p2
                  ? "won"
                  : "lost";
                const p2State = set.current
                  ? "current"
                  : set.retired
                  ? "prev"
                  : set.p2 > set.p1
                  ? "won"
                  : "lost";
                return (
                  <div key={si} className="flex items-center gap-[3px]">
                    <ScoreBox value={set.p1} state={p1State} />
                    <ScoreBox value={set.p2} state={p2State} />
                  </div>
                );
              })}
            </div>

            {/* STATUS */}
            <div className="flex flex-col items-center gap-1.5">
              {match.status === "live" ? <LiveBadge /> : <EndedBadge />}
              <button
                className="rounded-[3px] px-[6px] py-[2px] text-[11px] transition-all duration-100"
                style={{
                  color: "var(--cb-muted2, #b5b0a6)",
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--cb-border, #e2ddd4)";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--cb-ink, #0b0d14)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "none";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--cb-muted2, #b5b0a6)";
                }}
              >
                details ↓
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes cb-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}