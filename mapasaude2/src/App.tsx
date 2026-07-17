import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { List, Map as MapIcon } from "lucide-react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { FacilityList } from "./components/FacilityList";
import { MapView } from "./components/MapView";
import { FacilityDetail } from "./components/FacilityDetail";
import { FACILITIES } from "./data/facilities";
import type { FacilityType } from "./types";
import { distanceKm, getOpenStatus } from "./lib/facility-utils";
import { useGeolocation } from "./hooks/useGeolocation";

const ALAGOINHAS_CENTER: [number, number] = [-12.1358, -38.4192];

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<FacilityType>>(new Set());
  const [susOnly, setSusOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"lista" | "mapa">("lista");

  const { location, status, errorMessage, locate } = useGeolocation();
  const hasToastedRef = useRef(false);

  useEffect(() => {
    if (status === "loading") {
      hasToastedRef.current = false;
      toast.loading("Obtendo sua localização…", { id: "geo" });
    } else if (status === "error" && !hasToastedRef.current) {
      hasToastedRef.current = true;
      toast.error(errorMessage ?? "Não foi possível obter sua localização.", {
        id: "geo",
      });
    } else if (status === "idle" && location && !hasToastedRef.current) {
      hasToastedRef.current = true;
      toast.success("Localização encontrada", { id: "geo" });
    }
  }, [status, errorMessage, location]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FACILITIES.filter((f) => {
      if (activeTypes.size > 0 && !activeTypes.has(f.type)) return false;
      if (susOnly && !f.sus) return false;
      if (openNow && !getOpenStatus(f.hours).isOpen) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.neighborhood.toLowerCase().includes(q) ||
        f.services.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, activeTypes, susOnly, openNow]);

  const distances = useMemo(() => {
    const map = new Map<string, number>();
    if (!location) return map;
    FACILITIES.forEach((f) => {
      map.set(f.id, distanceKm(location.lat, location.lng, f.lat, f.lng));
    });
    return map;
  }, [location]);

  const sorted = useMemo(() => {
    if (!location) return filtered;
    return [...filtered].sort(
      (a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity),
    );
  }, [filtered, distances, location]);

  const selectedFacility = FACILITIES.find((f) => f.id === selectedId) ?? null;

  function toggleType(type: FacilityType) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function clearFilters() {
    setActiveTypes(new Set());
    setSusOnly(false);
    setOpenNow(false);
  }

  function select(id: string) {
    setSelectedId(id);
    setMobileView("mapa");
  }

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--ms-paper)" }}>
      <Toaster position="top-center" richColors />
      <Header
        query={query}
        onQueryChange={setQuery}
        resultCount={sorted.length}
        onLocate={locate}
        locateStatus={status}
      />
      <FilterBar
        activeTypes={activeTypes}
        onToggleType={toggleType}
        susOnly={susOnly}
        onToggleSus={() => setSusOnly((v) => !v)}
        openNow={openNow}
        onToggleOpenNow={() => setOpenNow((v) => !v)}
        onClear={clearFilters}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={`w-full flex-col border-r sm:flex sm:w-[380px] ${
            mobileView === "lista" ? "flex" : "hidden"
          }`}
          style={{ borderColor: "var(--ms-mist)" }}
        >
          <FacilityList
            facilities={sorted}
            distances={distances}
            selectedId={selectedId}
            onSelect={select}
          />
        </div>

        <div
          className={`relative flex-1 ${mobileView === "mapa" ? "block" : "hidden"} sm:block`}
        >
          <MapView
            facilities={sorted}
            selectedId={selectedId}
            onSelect={select}
            userLocation={location}
            center={ALAGOINHAS_CENTER}
          />
          <FacilityDetail
            facility={selectedFacility}
            distance={selectedId ? distances.get(selectedId) ?? null : null}
            onClose={() => setSelectedId(null)}
          />
        </div>

        <button
          onClick={() => setMobileView((v) => (v === "lista" ? "mapa" : "lista"))}
          className="fixed bottom-5 left-1/2 z-[600] flex -translate-x-1/2 items-center gap-2 rounded-[4px] px-4 py-2.5 text-sm font-semibold text-white shadow-lg sm:hidden"
          style={{ background: "var(--ms-blue)" }}
        >
          {mobileView === "lista" ? (
            <>
              <MapIcon size={16} /> Ver mapa
            </>
          ) : (
            <>
              <List size={16} /> Ver lista
            </>
          )}
        </button>
      </div>
    </div>
  );
}
