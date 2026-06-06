import type { Match } from "../types";
import { EVENTS, currentSetIndex, gamesWon, hash } from "../utils/helper";

interface Props {
  match: Match;
}

function H2H({
  a,
  b,
  label,
  nameA,
  nameB,
}: {
  a: number;
  b: number;
  label: string;
  nameA?: string;
  nameB?: string;
}) {
  const total = a + b || 1;
  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between">
        <span className="text-2xl font-black text-white">{a}</span>
        {/* slate-400 = 7.6:1 on dark bg — passes WCAG AA */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-2xl font-black text-white">{b}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-linear-to-r from-amber-400 to-amber-600 transition-all"
          style={{ width: `${(a / total) * 100}%` }}
        />
      </div>
      {nameA && nameB && (
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{nameA}</span>
          <span>{nameB}</span>
        </div>
      )}
    </div>
  );
}

export default function MatchDetail({ match }: Props) {
  const seed = hash(match.players[0].name + match.players[1].name);

  if (match.status === "upcoming") {
    const h2hA = 2 + (seed % 6);
    const h2hB = 1 + ((seed >> 3) % 5);
    return (
      <div className="grid gap-6 border-t border-slate-800/40 bg-slate-900/20 p-6 md:grid-cols-2">
        <div>
          {/* slate-300 = 12.6:1 — passes WCAG AAA */}
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
            Match Info
          </h3>
          <div className="flex flex-wrap gap-2">
            {[EVENTS[match.event], match.round, match.court, match.time].map((item, i) => (
              <span
                key={i}
                className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
            Head to Head
          </h3>
          <H2H
            a={h2hA}
            b={h2hB}
            label="All Time"
            nameA={match.players[0].name.split(" ").pop()}
            nameB={match.players[1].name.split(" ").pop()}
          />
        </div>
      </div>
    );
  }

  const currentSet = currentSetIndex(match);
  const games = gamesWon(match);

  return (
    <div className="grid gap-6 border-t border-slate-800/40 bg-slate-900/20 p-6 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          Score Breakdown
        </h3>
        <div className="space-y-5">
          {match.players.map((player, idx) => (
            <div key={player.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">{player.name}</span>
                {/* slate-400 = 7.6:1 — passes WCAG AA */}
                <span className="text-xs text-slate-400">
                  {match.sets.map((s) => s[idx]).join("  ")}
                </span>
              </div>
              <div className="space-y-1.5">
                {match.sets.map((set, setIndex) => {
                  const me = set[idx];
                  const opp = set[1 - idx];
                  const pct = (me / Math.max(me, opp, 1)) * 100;
                  const isCurrent = currentSet === setIndex;
                  return (
                    <div key={setIndex} className="flex items-center gap-3">
                      {/* slate-400 = 7.6:1 — passes WCAG AA */}
                      <span className="w-5 text-right text-[10px] text-slate-400">
                        G{setIndex + 1}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCurrent ? "bg-amber-500" : "bg-amber-600/50"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        className={`w-6 text-right text-sm font-bold ${
                          isCurrent ? "text-amber-400" : "text-white"
                        }`}
                      >
                        {me}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          Match Details
        </h3>
        <div className="mb-5 flex flex-wrap gap-2">
          {[EVENTS[match.event], `Games ${games[0]}–${games[1]}`, `Court ${match.court}`].map(
            (item, i) => (
              <span
                key={i}
                className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                {item}
              </span>
            )
          )}
        </div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          Career Meetings
        </h3>
        <H2H
          a={2 + (seed % 7)}
          b={1 + ((seed >> 3) % 6)}
          label="Head to Head"
          nameA={match.players[0].name.split(" ").pop()}
          nameB={match.players[1].name.split(" ").pop()}
        />
      </div>
    </div>
  );
}
