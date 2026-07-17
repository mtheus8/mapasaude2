import { SearchX } from "lucide-react";
import type { Facility } from "../types";
import { FacilityCard } from "./FacilityCard";

interface FacilityListProps {
  facilities: Facility[];
  distances: Map<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FacilityList({
  facilities,
  distances,
  selectedId,
  onSelect,
}: FacilityListProps) {
  if (facilities.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <SearchX size={28} style={{ color: "var(--ms-mist-strong)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--ms-ink)" }}>
          Nenhuma unidade encontrada
        </p>
        <p className="text-xs max-w-[220px]" style={{ color: "var(--ms-ink-soft)" }}>
          Tente ajustar a busca ou remover alguns filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="ms-scroll flex-1 overflow-y-auto">
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          distance={distances.get(facility.id) ?? null}
          selected={facility.id === selectedId}
          onSelect={() => onSelect(facility.id)}
        />
      ))}
    </div>
  );
}
