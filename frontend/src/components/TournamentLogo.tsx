import { useState } from "react";
import { HOST_FLAG } from "../utils/helper";
import type { Tournament } from "../types";

interface Props {
  tournament: Tournament;
}

export default function TournamentLogo({
  tournament,
}: Props) {
  const [error, setError] =
    useState(false);

  const iso =
    HOST_FLAG[
      tournament.code as keyof typeof HOST_FLAG
    ];

  if (!iso || error) {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{
          background:
            tournament.accent,
        }}
      >
        {tournament.code}
      </div>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${iso}.svg`}
      alt={tournament.location}
      className="h-12 w-12 rounded-xl object-cover border border-white/10"
      onError={() =>
        setError(true)
      }
    />
  );
}