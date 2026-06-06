import { ArrowDown, ArrowUp, Trophy } from "lucide-react";
import { useState } from "react";
import Flag from "./Flag";
import PlayerCard from "./PlayerCard";
import { ASOF, countryName, EVENTS, isDoublesDisc } from "../utils/helper";
import type { EventType, RankingEntry } from "../types";
import { RANKINGS } from "../data/rankings";

interface Props {
  discipline: EventType;
  query: string;
}

function podiumStyle(rank: number) {
  if (rank === 1) return "bg-linear-to-r from-amber-500/10 to-transparent border-l-2 border-amber-400";
  if (rank === 2) return "bg-linear-to-r from-slate-400/5 to-transparent border-l-2 border-slate-400";
  if (rank === 3) return "bg-linear-to-r from-amber-700/5 to-transparent border-l-2 border-amber-700";
  return "";
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={13} className="shrink-0 text-amber-400" />;
  if (rank === 2) return <span className="text-sm leading-none">🥈</span>;
  if (rank === 3) return <span className="text-sm leading-none">🥉</span>;
  return null;
}

export default function RankingsTable({ discipline, query }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<RankingEntry | null>(null);

  const rankings = RANKINGS[discipline] || [];

  const rows = rankings.filter((player) => {
    if (!query) return true;
    return (
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      countryName(player.country).toLowerCase().includes(query.toLowerCase())
    );
  });

  const doubles = isDoublesDisc(discipline);

  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="bg-linear-to-br from-white to-slate-400 bg-clip-text text-3xl font-black text-transparent">
            BWF World Rankings
          </h2>
          {/* slate-400 = 7.6:1 — passes WCAG AA */}
          <p className="mt-1 text-sm text-slate-400">
            {EVENTS[discipline]} · Top {rankings.length} players
          </p>
        </div>
        {/* slate-400 = 7.6:1 — passes WCAG AA */}
        <div className="text-xs font-medium text-slate-400">
          Official · {ASOF}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800/60 shadow-xl shadow-black/20">
        {/* Header — slate-300 = 12.6:1 for 10px bold uppercase text */}
        <div className="grid grid-cols-12 border-b border-slate-800/60 bg-slate-900/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          <div className="col-span-2">Rank</div>
          <div className="col-span-1">Move</div>
          <div className="col-span-5">{doubles ? "Pair" : "Player"}</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-center">Events</div>
        </div>

        {rows.map((player) => {
          const move = player.prev - player.rank;
          return (
            <button
              key={player.rank}
              onClick={() => setSelectedPlayer(player)}
              className={`grid w-full cursor-pointer grid-cols-12 items-center border-t border-slate-800/40 px-5 py-4 text-left transition-all duration-150 hover:bg-white/2 ${podiumStyle(player.rank)}`}
            >
              {/* Rank */}
              <div className="col-span-2 flex items-center gap-2">
                <RankIcon rank={player.rank} />
                <span
                  className={`font-black ${
                    player.rank === 1
                      ? "text-amber-400"
                      : player.rank <= 3
                      ? "text-slate-300"
                      : "text-white"
                  }`}
                >
                  #{player.rank}
                </span>
              </div>

              {/* Move */}
              <div className="col-span-1">
                {move > 0 && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-xs font-bold text-emerald-400">
                    <ArrowUp size={10} />
                    {move}
                  </span>
                )}
                {move < 0 && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 px-1.5 py-0.5 text-xs font-bold text-red-400">
                    <ArrowDown size={10} />
                    {Math.abs(move)}
                  </span>
                )}
                {/* slate-400 = 7.6:1 — passes WCAG AA */}
                {move === 0 && <span className="text-slate-400">—</span>}
              </div>

              {/* Player */}
              <div className="col-span-5 flex items-center gap-3">
                <Flag code={player.country} />
                <div>
                  <div className="font-semibold text-white">{player.name}</div>
                  {/* slate-400 = 7.6:1 — passes WCAG AA */}
                  <div className="text-xs text-slate-400">{countryName(player.country)}</div>
                </div>
              </div>

              {/* Points */}
              <div
                className={`col-span-2 text-right text-sm font-black ${
                  player.rank <= 3 ? "text-amber-400" : "text-white"
                }`}
              >
                {player.points.toLocaleString()}
              </div>

              {/* Events — slate-400 = 7.6:1 — passes WCAG AA */}
              <div className="col-span-2 text-center text-sm text-slate-400">
                {player.played}
              </div>
            </button>
          );
        })}
      </div>

      <PlayerCard
        player={selectedPlayer}
        discipline={discipline}
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  );
}
