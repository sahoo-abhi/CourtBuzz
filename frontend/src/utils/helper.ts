import type { Match } from "../types";

export const EVENTS = {
  MS: "Men's Singles",
  WS: "Women's Singles",
  MD: "Men's Doubles",
  WD: "Women's Doubles",
  XD: "Mixed Doubles",
} as const;

export const ASOF = "18 Mar 2026";

export const COUNTRIES = {
  DEN: { iso: "dk", name: "Denmark" },
  THA: { iso: "th", name: "Thailand" },
  KOR: { iso: "kr", name: "South Korea" },
  JPN: { iso: "jp", name: "Japan" },
  IND: { iso: "in", name: "India" },
  SGP: { iso: "sg", name: "Singapore" },
  CHN: { iso: "cn", name: "China" },
  INA: { iso: "id", name: "Indonesia" },
  MAS: { iso: "my", name: "Malaysia" },
  TPE: { iso: "tw", name: "Chinese Taipei" },
  ESP: { iso: "es", name: "Spain" },
} as const;

export const HOST_FLAG = {
  ENG: "gb-eng",
  IND: "in",
  INA: "id",
  MAS: "my",
  CHN: "cn",
} as const;

export function countryName(
  code: string
) {
  return (
    COUNTRIES[
      code as keyof typeof COUNTRIES
    ]?.name || code
  );
}

export function isoOf(code: string) {
  return (
    COUNTRIES[
      code as keyof typeof COUNTRIES
    ]?.iso || null
  );
}

export function isDoublesDisc(
  disc: string
) {
  return (
    disc === "MD" ||
    disc === "WD" ||
    disc === "XD"
  );
}

export function shade(
  hex: string,
  pct: number
) {
  const num = parseInt(
    hex.slice(1),
    16
  );

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.max(
    0,
    Math.min(
      255,
      r + (pct / 100) * 255
    )
  );

  g = Math.max(
    0,
    Math.min(
      255,
      g + (pct / 100) * 255
    )
  );

  b = Math.max(
    0,
    Math.min(
      255,
      b + (pct / 100) * 255
    )
  );

  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(v)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export function matchWinner(
  match: Match
) {
  if (
    match.status !== "finished"
  )
    return -1;

  let a = 0;
  let b = 0;

  match.sets.forEach((set) => {
    if (set[0] > set[1]) a++;
    else b++;
  });

  return a > b ? 0 : 1;
}

export function gamesWon(
  match: Match
) {
  let a = 0;
  let b = 0;

  match.sets.forEach((set) => {
    if (set[0] > set[1]) a++;
    else if (set[1] > set[0]) b++;
  });

  return [a, b];
}

export function currentSetIndex(
  match: Match
) {
  return match.status === "live"
    ? match.sets.length - 1
    : -1;
}

export function hash(
  str: string
) {
  let h = 0;

  for (
    let i = 0;
    i < str.length;
    i++
  ) {
    h =
      (h * 31 +
        str.charCodeAt(i)) |
      0;
  }

  return Math.abs(h);
}

export function matchUid(
  tournamentId: string,
  player1: string,
  player2: string,
  event: string
) {
  return (
    tournamentId +
    "-" +
    event +
    "-" +
    hash(player1 + player2)
  );
}

export function monogramURI(
  name: string
) {
  const tokens = name
    .replace(/\//g, " ")
    .split(" ")
    .map((t) =>
      t.replace(
        /[^A-Za-z]/g,
        ""
      )
    )
    .filter(Boolean);

  const initials =
    tokens
      .slice(0, 2)
      .map((t) => t[0])
      .join("")
      .toUpperCase() || "?";

  const h = hash(name) % 360;

  const c1 = `hsl(${h},52%,56%)`;
  const c2 = `hsl(${
    (h + 34) % 360
  },58%,44%)`;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <defs>
      <linearGradient id="g">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="220" height="220" fill="url(#g)"/>
    <text x="110" y="118"
      font-size="92"
      font-weight="800"
      fill="white"
      text-anchor="middle">
      ${initials}
    </text>
  </svg>`;

  return (
    "data:image/svg+xml," +
    encodeURIComponent(svg)
  );
}

const AV_BG = [
  "cfe8f5",
  "d8e7c8",
  "e8dff0",
  "fbe2cf",
  "f7d7da",
  "dfe3ee",
];

export function avatarURL(
  name: string
) {
  const bg =
    AV_BG[
      hash(name) %
        AV_BG.length
    ];

  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(
    name
  )}&backgroundColor=${bg}&radius=50`;
}