import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Flag from "./Flag";
import MatchDetail from "./MatchDetail";
import { countryName, currentSetIndex, matchWinner } from "../utils/helper";
import type { Match } from "../types";

interface Props {
  match: Match;
}

export default function MatchRow({ match }: Props) {
  const [open, setOpen] = useState(false);
  const winner = matchWinner(match);
  const currentSet = currentSetIndex(match);

  return (
    <div className="overflow-hidden border-b border-slate-800/40 last:border-0">
      <div
        onClick={() => setOpen(!open)}
        className="grid cursor-pointer grid-cols-12 items-center gap-3 px-5 py-4 transition-all duration-150 hover:bg-white/2"
      >
        {/* Event + Round */}
        <div className="col-span-2">
          <div className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            {match.round}
          </div>
          <div className="mt-0.5 text-sm font-bold text-amber-400">{match.event}</div>
        </div>

        {/* Players */}
        <div className="col-span-5 space-y-2.5">
          {match.players.map((player, index) => {
            const isWinner = winner === index;
            const isLoser = winner !== null && winner !== index;
            return (
              <div
                key={player.name}
                className={`flex items-center gap-2.5 transition-opacity ${isLoser ? "opacity-40" : ""}`}
              >
                <Flag code={player.country} />
                <div className="min-w-0 flex-1">
                  <div
                    className={`flex items-center gap-1.5 truncate text-sm font-semibold ${
                      isWinner ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {player.name}
                    {(match as any).serving === index && match.status === "live" && (
                      <span
                        className="live-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
                        title="Serving"
                      />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {countryName(player.country)}
                  </div>
                </div>
                {player.seed && (
                  <span className="shrink-0 rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                    [{player.seed}]
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Scores — one row per player, one cell per set */}
        <div className="col-span-3 space-y-2.5">
          {match.players.map((player, playerIdx) => (
            <div key={player.name} className="flex gap-1.5">
              {match.sets.map((set, setIndex) => {
                const score = set[playerIdx];
                const oppScore = set[1 - playerIdx];
                const isCurrent = currentSet === setIndex && match.status === "live";
                const isWon = winner !== null && score > oppScore;
                return (
                  <span
                    key={setIndex}
                    className={`flex h-7 w-8 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      isCurrent
                        ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                        : isWon
                        ? "bg-slate-700 text-white"
                        : "bg-slate-800/60 text-slate-400"
                    }`}
                  >
                    {score}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="col-span-1">
          {match.status === "live" && (
            <div className="flex items-center gap-1.5">
              <span className="live-dot h-2 w-2 shrink-0 rounded-full bg-red-400" />
              <span className="text-xs font-bold text-red-400">LIVE</span>
            </div>
          )}
          {match.status === "finished" && (
            <span className="text-xs text-slate-400">Final</span>
          )}
          {match.status === "upcoming" && (
            <span className="text-xs font-medium text-slate-400">{match.time}</span>
          )}
        </div>

        {/* Chevron */}
        <div className="col-span-1 flex justify-end">
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? "rotate-180 text-amber-400" : "text-slate-400"
            }`}
          />
        </div>
      </div>

      {open && <MatchDetail match={match} />}
    </div>
  );
}
