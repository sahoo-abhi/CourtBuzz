import { useState } from "react";
import { COUNTRIES } from "../utils/helper";

interface FlagProps {
  code: string;
  className?: string;
}

export default function Flag({
  code,
  className = "h-5 w-7 rounded object-cover",
}: FlagProps) {
  const [error, setError] = useState(false);

  const country =
    COUNTRIES[
      code as keyof typeof COUNTRIES
    ];

  if (!country || error) {
    return (
      <span className="inline-flex h-5 min-w-8 items-center justify-center rounded-md bg-slate-700 px-2 text-[10px] font-bold text-white">
        {code}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${country.iso}.svg`}
      alt={country.name}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}