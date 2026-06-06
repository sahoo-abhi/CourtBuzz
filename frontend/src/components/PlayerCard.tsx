import { X } from "lucide-react";
import { useEffect } from "react";

import Flag from "./Flag";

import {
  avatarURL,
  countryName,
  EVENTS,
  isoOf,
  isDoublesDisc,
  monogramURI,
} from "../utils/helper";

import type {
  EventType,
  RankingEntry,
} from "../types";

interface Props {
  player: RankingEntry | null;
  discipline: EventType;
  onClose: () => void;
}

export default function PlayerCard({
  player,
  discipline,
  onClose,
}: Props) {
  useEffect(() => {
    const handleKey = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Escape")
        onClose();
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, [onClose]);

  if (!player) return null;

  const doubles =
    isDoublesDisc(discipline);

  const stats =
    player.stats as any;

  const iso = isoOf(
    player.country
  );

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-950">
        {/* HERO */}

        <div className="relative h-44 overflow-hidden">
          {iso ? (
            <img
              src={`https://flagcdn.com/${iso}.svg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-r from-slate-700 to-slate-900" />
          )}

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl bg-black/50 p-2 text-white"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-4 left-6">
            <div className="mb-2 inline-flex rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-black">
              #{player.rank}
            </div>

            <h2 className="text-3xl font-black text-white">
              {player.name}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-slate-300">
              <Flag
                code={
                  player.country
                }
              />

              {countryName(
                player.country
              )}

              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">
                {
                  EVENTS[
                    discipline
                  ]
                }
              </span>
            </div>
          </div>
        </div>

        {/* AVATAR */}

        <div className="-mt-12 px-6">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-slate-950">
            <img
              src={avatarURL(
                player.name
              )}
              alt={player.name}
              className="h-full w-full"
              onError={(
                e
              ) => {
                (
                  e.target as HTMLImageElement
                ).src =
                  monogramURI(
                    player.name
                  );
              }}
            />
          </div>
        </div>

        {/* BODY */}

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Points"
              value={player.points.toLocaleString()}
            />

            <StatCard
              title="Career High"
              value={`#${stats.high}`}
            />

            <StatCard
              title="Titles"
              value={
                stats.titles
              }
            />

            <StatCard
              title="Win Rate"
              value={`${stats.winRate}%`}
            />
          </div>

          {/* META */}

          <div className="mt-6 flex flex-wrap gap-2">
            <Tag>
              Rank #
              {player.rank}
            </Tag>

            <Tag>
              Events{" "}
              {
                player.played
              }
            </Tag>

            {doubles ? (
              <Tag>
                Pair Since{" "}
                {
                  stats.since
                }
              </Tag>
            ) : (
              <>
                <Tag>
                  Age{" "}
                  {
                    stats.age
                  }
                </Tag>

                <Tag>
                  Height{" "}
                  {
                    stats.height
                  }
                </Tag>

                <Tag>
                  {
                    stats.plays
                  }{" "}
                  Handed
                </Tag>
              </>
            )}
          </div>

          {/* FORM */}

          <div className="mt-8">
            <h3 className="mb-3 text-lg font-semibold text-white">
              Recent Form
            </h3>

            <div className="flex gap-2">
              {stats.form.map(
                (
                  item: string,
                  index: number
                ) => (
                  <div
                    key={
                      index
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      item ===
                      "W"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value:
    | string
    | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="text-2xl font-bold text-white">
        {value}
      </div>

      <div className="text-sm text-slate-400">
        {title}
      </div>
    </div>
  );
}

function Tag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300">
      {children}
    </span>
  );
}