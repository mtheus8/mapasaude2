import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Facility } from "../types";
import { FACILITY_TYPE_INFO } from "../types";
import { getOpenStatus } from "../lib/facility-utils";
import type { UserLocation } from "../hooks/useGeolocation";

interface MapViewProps {
  facilities: Facility[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation: UserLocation | null;
  center: [number, number];
}

function markerIcon(facility: Facility, active: boolean) {
  const info = FACILITY_TYPE_INFO[facility.type];
  const size = active ? 34 : 26;
  return L.divIcon({
    html: `<div class="ms-marker" style="width:${size}px;height:${size}px;background:${info.color};border-radius:${
      active ? "6px" : "50%"
    };font-size:${active ? "10px" : "9px"};transform:${active ? "scale(1)" : "scale(1)"}">${info.code.slice(0, active ? 4 : 2)}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function userIcon() {
  return L.divIcon({
    html: `<div class="ms-marker ms-marker-user" style="width:16px;height:16px;"></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function MapView({
  facilities,
  selectedId,
  onSelect,
  userLocation,
  center,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Inicializa o mapa uma única vez
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(center, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza os marcadores das unidades
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const seen = new Set<string>();

    facilities.forEach((facility) => {
      seen.add(facility.id);
      const isActive = facility.id === selectedId;
      const existing = markersRef.current.get(facility.id);

      if (existing) {
        existing.setIcon(markerIcon(facility, isActive));
        existing.setZIndexOffset(isActive ? 1000 : 0);
      } else {
        const status = getOpenStatus(facility.hours);
        const marker = L.marker([facility.lat, facility.lng], {
          icon: markerIcon(facility, isActive),
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:var(--font-body);padding:10px 12px;">
              <div style="font-family:var(--font-mono);font-size:10px;font-weight:600;color:${
                FACILITY_TYPE_INFO[facility.type].color
              };">${FACILITY_TYPE_INFO[facility.type].code}</div>
              <div style="font-weight:600;font-size:13px;margin-top:2px;">${facility.name}</div>
              <div style="font-size:11px;color:#545b66;margin-top:2px;">${facility.address}</div>
              <div style="font-size:11px;margin-top:4px;color:${status.isOpen ? "#1c8f5c" : "#e8572e"};font-weight:500;">${status.label}</div>
            </div>`,
          );
        marker.on("click", () => onSelect(facility.id));
        markersRef.current.set(facility.id, marker);
      }
    });

    // Remove marcadores de unidades que saíram do filtro
    markersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities, selectedId]);

  // Marcador de localização do usuário
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon(),
          zIndexOffset: 2000,
        }).addTo(map);
      }
      map.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    }
  }, [userLocation]);

  // Centraliza no item selecionado
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const facility = facilities.find((f) => f.id === selectedId);
    if (facility) {
      map.panTo([facility.lat, facility.lng], { animate: true });
      markersRef.current.get(selectedId)?.openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
