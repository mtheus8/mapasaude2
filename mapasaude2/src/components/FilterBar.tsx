import { FACILITY_TYPE_INFO, type FacilityType } from "../types";

interface FilterBarProps {
  activeTypes: Set<FacilityType>;
  onToggleType: (type: FacilityType) => void;
  susOnly: boolean;
  onToggleSus: () => void;
  openNow: boolean;
  onToggleOpenNow: () => void;
  onClear: () => void;
}

const TYPE_ORDER: FacilityType[] = [
  "ubs",
  "upa",
  "hospital",
  "farmacia_popular",
  "farmacia_privada",
  "clinica",
  "caps",
  "laboratorio",
];

export function FilterBar({
  activeTypes,
  onToggleType,
  susOnly,
  onToggleSus,
  openNow,
  onToggleOpenNow,
  onClear,
}: FilterBarProps) {
  const anyActive = activeTypes.size > 0 || susOnly || openNow;

  return (
    <div className="ms-scroll flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2.5 sm:px-6"
      style={{ borderColor: "var(--ms-mist)" }}
    >
      <button
        onClick={onToggleOpenNow}
        className="shrink-0 rounded-[4px] border-2 px-2.5 py-1 text-xs font-semibold font-mono transition-colors"
        style={
          openNow
            ? { borderColor: "var(--ms-green)", background: "var(--ms-green)", color: "white" }
            : { borderColor: "var(--ms-mist-strong)", color: "var(--ms-ink-soft)" }
        }
      >
        Aberto agora
      </button>
      <button
        onClick={onToggleSus}
        className="shrink-0 rounded-[4px] border-2 px-2.5 py-1 text-xs font-semibold font-mono transition-colors"
        style={
          susOnly
            ? { borderColor: "var(--ms-blue)", background: "var(--ms-blue)", color: "white" }
            : { borderColor: "var(--ms-mist-strong)", color: "var(--ms-ink-soft)" }
        }
      >
        Atende SUS
      </button>
      <span className="mx-1 h-5 w-px shrink-0" style={{ background: "var(--ms-mist)" }} />
      {TYPE_ORDER.map((type) => {
        const info = FACILITY_TYPE_INFO[type];
        const active = activeTypes.has(type);
        return (
          <button
            key={type}
            onClick={() => onToggleType(type)}
            className="shrink-0 rounded-[4px] border-2 px-2 py-1 text-[11px] font-semibold font-mono transition-colors"
            style={
              active
                ? { borderColor: info.color, background: info.color, color: "white" }
                : { borderColor: info.color, color: info.color, background: info.tint }
            }
          >
            {info.code}
          </button>
        );
      })}
      {anyActive && (
        <button
          onClick={onClear}
          className="ml-1 shrink-0 text-[11px] font-medium underline"
          style={{ color: "var(--ms-ink-soft)" }}
        >
          Limpar
        </button>
      )}
    </div>
  );
}
