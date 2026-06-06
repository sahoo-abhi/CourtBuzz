interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: { live: number; ongoing: number; past: number };
}

const TABS = [
  { id: "live",     label: "Live",                badgeType: "live" },
  { id: "ongoing",  label: "Ongoing Tournaments",  badgeType: "gray" },
  { id: "past",     label: "Past Tournaments",     badgeType: "gray" },
  { id: "rankings", label: "World Rankings",       badgeType: "none" },
];

export default function Tabs({ activeTab, onTabChange, counts }: TabsProps) {
  const badgeCount = (id: string) => {
    if (id === "live")    return counts.live;
    if (id === "ongoing") return counts.ongoing;
    if (id === "past")    return counts.past;
    return null;
  };

  return (
    <div
      style={{
        background: "#faf7f2",
        borderBottom: "1px solid #e0d5c5",
        display: "flex",
        padding: "0 28px",
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        const count  = badgeCount(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: "13px 18px",
              fontSize: 12,
              fontWeight: 500,
              color: active ? "#1c1208" : "#7a6a55",
              borderBottom: `2px solid ${active ? "#1c1208" : "transparent"}`,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${active ? "#1c1208" : "transparent"}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {tab.label}
            {count != null && (
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: 10,
                  background: tab.badgeType === "live" ? "#fdf0ee" : "#ede6da",
                  color:      tab.badgeType === "live" ? "#a83225" : "#7a6a55",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}