const TICKER_ITEMS = [
  { p1: "Axelsen", p2: "Shi Yuqi", score: "21-18 18-14 14-9", set: "3rd set" },
  { p1: "An Se-young", p2: "Yamaguchi", score: "21-19 11-16", set: "2nd set" },
  { p1: "Lakshya Sen", p2: "Loh Kean Yew", score: "21-9 11-7", set: "2nd set" },
  { p1: "Kevin / Marcus", p2: "Ahsan / Hendra", score: "18-21 16-18", set: "2nd set" },
  { p1: "Fajar / Rian", p2: "Lee Yang / Wang", score: "21-17 21-14" },
];

export default function LiveTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      style={{
        background: "#3d2a18",   // dark walnut — one shade lighter than nav
        borderBottom: "1px solid #6b3f1f",
        height: 32,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* LIVE label */}
      <div
        style={{
          background: "#d4840a",
          color: "#fff",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.18em",
          padding: "0 14px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          textTransform: "uppercase",
        }}
      >
        live
      </div>

      {/* scrolling track */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "tickerScroll 36s linear infinite",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0 28px",
                borderRight: "1px solid rgba(245,240,232,0.08)",
                fontSize: 11,
                color: "rgba(245,240,232,0.45)",
              }}
            >
              <span>
                <b style={{ fontWeight: 500, color: "rgba(245,240,232,0.8)" }}>{item.p1}</b>
                {" v "}
                <b style={{ fontWeight: 500, color: "rgba(245,240,232,0.8)" }}>{item.p2}</b>
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "#d4840a",
                }}
              >
                {item.score}
              </span>
              {item.set && (
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8,
                    color: "#d4840a",
                    border: "1px solid rgba(212,132,10,0.4)",
                    padding: "1px 5px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.set}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}