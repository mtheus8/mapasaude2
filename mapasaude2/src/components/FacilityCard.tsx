import { Clock } from "lucide-react";
import type { Facility } from "../types";
import { TypeBadge } from "./TypeBadge";
import { StarRating } from "./StarRating";
import { formatDistance, getOpenStatus } from "../lib/facility-utils";

interface FacilityCardProps {
  facility: Facility;
  distance: number | null;
  selected: boolean;
  onSelect: () => void;
}

export function FacilityCard({
  facility,
  distance,
  selected,
  onSelect,
}: FacilityCardProps) {
  const status = getOpenStatus(facility.hours);

  return (
    <button
      onClick={onSelect}
      className="w-full border-b px-4 py-3 text-left transition-colors sm:px-6"
      style={{
        borderColor: "var(--ms-mist)",
        background: selected ? "var(--ms-blue-tint)" : "transparent",
        borderLeft: selected
          ? "4px solid var(--ms-blue)"
          : "4px solid transparent",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <TypeBadge type={facility.type} />
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-snug truncate" style={{ color: "var(--ms-ink)" }}>
              {facility.name}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--ms-ink-soft)" }}>
              {facility.address} · {facility.neighborhood}
            </p>
          </div>
        </div>
        {distance !== null && (
          <span
            className="shrink-0 font-mono text-xs font-semibold"
            style={{ color: "var(--ms-ink)" }}
          >
            {formatDistance(distance)}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-[calc(0px)]">
        <StarRating rating={facility.rating} reviewCount={facility.reviewCount} />
        <span
          className="inline-flex items-center gap-1 text-xs font-medium"
          style={{ color: status.isOpen ? "var(--ms-green)" : "var(--ms-coral)" }}
        >
          <Clock size={12} />
          {status.label}
        </span>
        {facility.sus && (
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: "var(--ms-blue)" }}
          >
            SUS
          </span>
        )}
      </div>
    </button>
  );
}
