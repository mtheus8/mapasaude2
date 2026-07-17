import { FACILITY_TYPE_INFO, type FacilityType } from "../types";

interface TypeBadgeProps {
  type: FacilityType;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const info = FACILITY_TYPE_INFO[type];
  const isSmall = size === "sm";
  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-semibold tracking-wide border-2 ${
        isSmall ? "px-1.5 py-0.5 text-[11px] rounded-[3px]" : "px-2.5 py-1 text-sm rounded-[4px]"
      }`}
      style={{
        color: info.color,
        borderColor: info.color,
        backgroundColor: info.tint,
        fontFamily: "var(--font-mono)",
      }}
      title={info.label}
    >
      {info.code}
    </span>
  );
}
