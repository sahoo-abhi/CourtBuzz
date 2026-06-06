import { useMemo, useRef, useState } from "react";

import TopBar from "../components/TopBar";
import LiveTicker from "../components/LiveTicker";
import Tabs from "../components/Tabs";
import Filters from "../components/Filters";
import TournamentSection from "../components/TournamentSection";
import RankingsTable from "../components/RankingsTable";

import { TOURNAMENTS } from "../data/tournament";
import { EVENTS } from "../utils/helper";

export default function Homepage() {
  const [tab, setTab] = useState("live");
  const [event, setEvent] = useState("ALL");
  const [query, setQueryRaw] = useState("");
  const [search, setSearch] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setQuery = (value: string) => {
    setQueryRaw(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(value.trim().toLowerCase());
    }, 150);
  };

  const counts = useMemo(
    () => ({
      live: TOURNAMENTS.reduce(
        (n: any, t: any) =>
          n + t.matches.filter((m: any) => m.status === "live").length,
        0
      ),
      ongoing: TOURNAMENTS.filter((t: any) => t.status === "ongoing").length,
      past: TOURNAMENTS.filter((t) => t.status === "past").length,
    }),
    []
  );

  const matchesQuery = (match: any, tournament: any) => {
    if (!search) return true;
    const haystack = (
      match.players
        .map((p: any) => `${p.name} ${p.country}`)
        .join(" ") +
      tournament.name +
      EVENTS[match.event as keyof typeof EVENTS] +
      tournament.location
    ).toLowerCase();
    return haystack.includes(search);
  };

  const passEvent = (match: any) =>
    event === "ALL" || match.event === event;

  const visible = useMemo(() => {
    let pool: any[] = [];

    if (tab === "live") {
      pool = TOURNAMENTS.map((t: any) => ({
        tournament: t,
        matches: t.matches.filter(
          (m: any) =>
            m.status === "live" && passEvent(m) && matchesQuery(m, t)
        ),
      }));
    } else if (tab === "ongoing") {
      pool = TOURNAMENTS.filter((t: any) => t.status === "ongoing").map((t: any) => ({
        tournament: t,
        matches: t.matches.filter(
          (m: any) => passEvent(m) && matchesQuery(m, t)
        ),
      }));
    } else if (tab === "past") {
      pool = TOURNAMENTS.filter((t: any) => t.status === "past").map((t: any) => ({
        tournament: t,
        matches: t.matches.filter(
          (m: any) => passEvent(m) && matchesQuery(m, t)
        ),
      }));
    }

    return pool.filter((item) => item.matches.length > 0);
  }, [tab, event, search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",   // warm beige page
        color: "#1c1208",

        // ── design tokens ──────────────────────────────
        "--cb-ink":        "#1c1208",   // rich dark brown text
        "--cb-paper":      "#f5f0e8",   // warm beige background
        "--cb-card":       "#faf7f2",   // slightly lighter card
        "--cb-border":     "#e0d5c5",   // warm tan border
        "--cb-amber":      "#b8620a",   // deep amber
        "--cb-amber-bg":   "#fdf0dc",   // amber tint bg
        "--cb-amber-mid":  "#d4840a",   // mid amber (accents)
        "--cb-red":        "#a83225",   // muted red for live
        "--cb-red-bg":     "#fdf0ee",
        "--cb-muted":      "#7a6a55",   // warm muted brown
        "--cb-muted2":     "#a89880",   // lighter muted
        "--cb-nav":        "#2c1f14",   // walnut navbar
        "--cb-nav-border": "#6b3f1f",   // chestnut border
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        ::placeholder { color: rgba(245,240,232,0.3); }
      `}</style>

      {/* 1. NAVBAR — not sticky, sits at top */}
      <TopBar query={query} setQuery={setQuery} liveCount={counts.live} />

      {/* 2. LIVE TICKER */}
      <LiveTicker />

      {/* 3. SUBNAV TABS */}
      <Tabs
        activeTab={tab}
        onTabChange={(value) => {
          setTab(value);
          if (value === "rankings" && event === "ALL") setEvent("MS");
        }}
        counts={counts}
      />

      {/* 4. MAIN CONTENT */}
      <main style={{ padding: "20px 28px 40px" }}>
        <Filters tab={tab} selectedEvent={event} onEventChange={setEvent} />

        {tab === "rankings" ? (
          <RankingsTable
            discipline={event === "ALL" ? "MS" : (event as any)}
            query={search}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {visible.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0", color: "var(--cb-muted)" }}>
                No matches found.
              </div>
            ) : (
              visible.map((item) => (
                <TournamentSection
                  key={item.tournament.id}
                  tournament={item.tournament}
                  matches={item.matches}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}