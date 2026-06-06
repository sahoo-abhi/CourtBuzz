const EVENTS_LIST = [
  { id: "ALL", label: "All Events" },
  { id: "MS",  label: "MS · Men's Singles" },
  { id: "WS",  label: "WS · Women's Singles" },
  { id: "MD",  label: "MD · Men's Doubles" },
  { id: "WD",  label: "WD · Women's Doubles" },
  { id: "XD",  label: "XD · Mixed Doubles" },
];
const RANKINGS_EVENTS = [
  { id: "MS", label: "Men's Singles" },
  { id: "WS", label: "Women's Singles" },
  { id: "MD", label: "Men's Doubles" },
  { id: "WD", label: "Women's Doubles" },
  { id: "XD", label: "Mixed Doubles" },
];

interface FiltersProps {
  tab: string;
  selectedEvent: string;
  onEventChange: (e: string) => void;
}

export default function Filters({ tab, selectedEvent, onEventChange }: FiltersProps) {
  const list = tab === "rankings" ? RANKINGS_EVENTS : EVENTS_LIST;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
      {list.map((ev) => {
        const active = selectedEvent === ev.id;
        return (
          <button
            key={ev.id}
            onClick={() => onEventChange(ev.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 4,
              border: `1px solid ${active ? "#1c1208" : "#e0d5c5"}`,
              background: active ? "#1c1208" : "#faf7f2",
              color: active ? "#f5f0e8" : "#7a6a55",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.03em",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {ev.label}
          </button>
        );
      })}
    </div>
  );
}