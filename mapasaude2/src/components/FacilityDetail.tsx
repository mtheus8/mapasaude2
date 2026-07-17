import { AnimatePresence, motion } from "motion/react";
import { Clock, MapPin, Phone, Route, ShieldCheck, X } from "lucide-react";
import type { Facility } from "../types";
import { TypeBadge } from "./TypeBadge";
import { StarRating } from "./StarRating";
import {
  directionsUrl,
  formatDistance,
  getOpenStatus,
} from "../lib/facility-utils";
import { FACILITY_TYPE_INFO } from "../types";

interface FacilityDetailProps {
  facility: Facility | null;
  distance: number | null;
  onClose: () => void;
}

const WAIT_LABEL: Record<Facility["waitLevel"], { label: string; color: string }> = {
  baixa: { label: "Espera baixa", color: "var(--ms-green)" },
  media: { label: "Espera moderada", color: "var(--ms-amber)" },
  alta: { label: "Espera alta", color: "var(--ms-coral)" },
};

export function FacilityDetail({
  facility,
  distance,
  onClose,
}: FacilityDetailProps) {
  return (
    <AnimatePresence>
      {facility && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 340 }}
          className="ms-scroll absolute inset-x-0 bottom-0 z-[500] max-h-[78%] overflow-y-auto rounded-t-[10px] border-t-4 bg-white shadow-[0_-8px_28px_rgba(16,20,28,0.22)] sm:absolute sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-none sm:w-[380px] sm:rounded-t-none sm:border-t-0 sm:border-l-4"
          style={{ borderColor: FACILITY_TYPE_INFO[facility.type].color }}
        >
          <div className="sticky top-0 flex items-start justify-between gap-3 border-b bg-white px-5 pt-4 pb-3" style={{ borderColor: "var(--ms-mist)" }}>
            <div>
              <TypeBadge type={facility.type} size="md" />
              <h2 className="mt-2 text-xl font-bold leading-tight" style={{ color: "var(--ms-ink)" }}>
                {facility.name}
              </h2>
              <div className="mt-1">
                <StarRating rating={facility.rating} reviewCount={facility.reviewCount} size={14} />
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="shrink-0 rounded-[4px] p-1.5 text-[var(--ms-ink-soft)] hover:bg-[var(--ms-paper)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoBlock
                icon={<Clock size={14} />}
                label={getOpenStatus(facility.hours).label}
                tone={getOpenStatus(facility.hours).isOpen ? "var(--ms-green)" : "var(--ms-coral)"}
              />
              <InfoBlock
                icon={<Route size={14} />}
                label={distance !== null ? formatDistance(distance) : "Distância indisponível"}
                tone="var(--ms-ink)"
              />
            </div>

            <div className="flex items-start gap-2 text-sm" style={{ color: "var(--ms-ink)" }}>
              <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--ms-ink-soft)" }} />
              <span>
                {facility.address} — {facility.neighborhood}
              </span>
            </div>

            {facility.phone && (
              <a
                href={`tel:${facility.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--ms-blue)" }}
              >
                <Phone size={15} />
                {facility.phone}
              </a>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {facility.sus && (
                <span
                  className="inline-flex items-center gap-1 rounded-[4px] border-2 px-2 py-1 text-[11px] font-mono font-semibold"
                  style={{ borderColor: "var(--ms-blue)", color: "var(--ms-blue)", background: "var(--ms-blue-tint)" }}
                >
                  <ShieldCheck size={12} /> ATENDE SUS
                </span>
              )}
              <span
                className="inline-flex items-center rounded-[4px] px-2 py-1 text-[11px] font-mono font-semibold"
                style={{ color: WAIT_LABEL[facility.waitLevel].color }}
              >
                {WAIT_LABEL[facility.waitLevel].label}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ms-ink-soft)" }}>
                Serviços
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {facility.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-[4px] border px-2 py-1 text-xs"
                    style={{ borderColor: "var(--ms-mist)", color: "var(--ms-ink)" }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={directionsUrl(facility.lat, facility.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-[4px] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--ms-blue)" }}
            >
              <Route size={16} />
              Como chegar
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoBlock({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-[4px] px-2.5 py-2 text-xs font-medium"
      style={{ background: "var(--ms-paper)", color: tone }}
    >
      {icon}
      {label}
    </div>
  );
}
