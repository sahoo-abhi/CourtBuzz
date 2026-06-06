import { useState } from "react";

interface TopBarProps {
  query: string;
  setQuery: (v: string) => void;
  liveCount: number;
}

export default function TopBar({ query, setQuery, liveCount }: TopBarProps) {
  const [dark, setDark] = useState(false);
  const [focused, setFocused] = useState(false);

  const toggleTheme = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav
      style={{
        background: "#2c1f14",
        borderBottom: "2px solid #6b3f1f",
        height: 58,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 16,
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* ── LOGO ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto", flexShrink: 0 }}>
        <div
          style={{
            width: 34,
            height: 34,
            background: "linear-gradient(135deg,#d4840a,#f0a030)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17,
            boxShadow: "0 2px 8px rgba(212,132,10,0.35)",
          }}
        >
          🏸
        </div>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 24,
            letterSpacing: "0.05em",
            color: "#f5f2eb",
            lineHeight: 1,
          }}
        >
          Court<span style={{ color: "#f0a030" }}>Buzz</span>
        </span>
      </div>

      {/* ── SEARCH ── */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* search icon */}
        <svg
          style={{
            position: "absolute",
            left: 11,
            width: 14,
            height: 14,
            color: focused ? "#f0a030" : "rgba(245,242,235,0.35)",
            pointerEvents: "none",
            transition: "color 0.2s",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search players, tournaments…"
          style={{
            width: focused ? 300 : 220,
            background: focused ? "rgba(245,242,235,0.12)" : "rgba(245,242,235,0.07)",
            border: `1px solid ${focused ? "rgba(240,160,48,0.6)" : "rgba(245,242,235,0.12)"}`,
            borderRadius: 10,
            padding: "7px 40px 7px 32px",
            color: "#f5f2eb",
            fontSize: 12,
            outline: "none",
            fontFamily: "inherit",
            transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), background 0.2s, border-color 0.2s",
          }}
        />

        {/* ⌘K hint */}
        <div
          style={{
            position: "absolute",
            right: 10,
            display: "flex",
            gap: 2,
            opacity: focused ? 0 : 1,
            transition: "opacity 0.15s",
            pointerEvents: "none",
          }}
        >
          {["⌘", "K"].map((k) => (
            <span
              key={k}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: "rgba(245,242,235,0.25)",
                background: "rgba(245,242,235,0.07)",
                border: "1px solid rgba(245,242,235,0.1)",
                borderRadius: 4,
                padding: "1px 5px",
                lineHeight: 1.4,
              }}
            >
              {k}
            </span>
          ))}
        </div>

        {/* amber underline on focus */}
        <span
          style={{
            position: "absolute",
            bottom: -1,
            left: "50%",
            transform: "translateX(-50%)",
            height: 2,
            width: focused ? "80%" : "0%",
            background: "linear-gradient(90deg,transparent,#f0a030,transparent)",
            borderRadius: 1,
            transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── DIVIDER ── */}
      <span style={{ width: 1, height: 22, background: "rgba(245,242,235,0.1)", flexShrink: 0 }} />

      {/* ── BELL ── */}
      <button
        aria-label="Notifications"
        style={{
          width: 36, height: 36,
          borderRadius: 10,
          border: "1px solid transparent",
          background: "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(245,242,235,0.45)",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(245,242,235,0.08)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,242,235,0.12)";
          (e.currentTarget as HTMLElement).style.color = "#f5f2eb";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          (e.currentTarget as HTMLElement).style.color = "rgba(245,242,235,0.45)";
        }}
      >
        <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
        </svg>
        {liveCount > 0 && (
          <span
            style={{
              position: "absolute", top: 7, right: 7,
              width: 6, height: 6, borderRadius: "50%",
              background: "#e05b4b",
              border: "1.5px solid #2c1f14",
            }}
          />
        )}
      </button>

      {/* ── THEME TOGGLE ── */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          width: 36, height: 36,
          borderRadius: 10,
          border: "1px solid transparent",
          background: "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(245,242,235,0.45)",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(245,242,235,0.08)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,242,235,0.12)";
          (e.currentTarget as HTMLElement).style.color = "#f5f2eb";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          (e.currentTarget as HTMLElement).style.color = "rgba(245,242,235,0.45)";
        }}
      >
        {dark ? (
          <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="5"/>
            <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </nav>
  );
}