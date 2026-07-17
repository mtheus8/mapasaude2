import type { Facility } from "../types";

/** Distância aproximada em km entre duas coordenadas (fórmula de Haversine). */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export interface OpenStatus {
  isOpen: boolean;
  label: string;
}

export function getOpenStatus(
  hours: Facility["hours"],
  now: Date = new Date(),
): OpenStatus {
  if (hours.is24h) return { isOpen: true, label: "Aberto 24h" };

  const day = now.getDay();
  if (hours.closedDays?.includes(day)) {
    return { isOpen: false, label: "Fechado hoje" };
  }
  if (!hours.open || !hours.close) return { isOpen: false, label: "Fechado" };

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (minutesNow >= openMinutes && minutesNow < closeMinutes) {
    return { isOpen: true, label: `Aberto até ${hours.close}` };
  }
  if (minutesNow < openMinutes) {
    return { isOpen: false, label: `Abre às ${hours.open}` };
  }
  return { isOpen: false, label: "Fechado" };
}

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
