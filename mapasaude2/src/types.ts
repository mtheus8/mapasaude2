export type FacilityType =
  | "ubs"
  | "upa"
  | "hospital"
  | "farmacia_popular"
  | "farmacia_privada"
  | "clinica"
  | "caps"
  | "laboratorio";

export type WaitLevel = "baixa" | "media" | "alta";

export interface FacilityHours {
  is24h: boolean;
  open?: string; // "07:00"
  close?: string; // "19:00"
  closedDays?: number[]; // 0 = domingo ... 6 = sábado
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  phone?: string;
  hours: FacilityHours;
  rating: number;
  reviewCount: number;
  sus: boolean;
  services: string[];
  waitLevel: WaitLevel;
}

export interface FacilityTypeInfo {
  code: string;
  label: string;
  color: string;
  tint: string;
}

export const FACILITY_TYPE_INFO: Record<FacilityType, FacilityTypeInfo> = {
  ubs: {
    code: "UBS",
    label: "Unidade Básica de Saúde",
    color: "var(--ms-blue)",
    tint: "var(--ms-blue-tint)",
  },
  upa: {
    code: "UPA",
    label: "Pronto Atendimento 24h",
    color: "var(--ms-coral)",
    tint: "var(--ms-coral-tint)",
  },
  hospital: {
    code: "HOSP",
    label: "Hospital",
    color: "#7A2E8F",
    tint: "#f1e6f6",
  },
  farmacia_popular: {
    code: "FP",
    label: "Farmácia Popular",
    color: "var(--ms-green)",
    tint: "var(--ms-green-tint)",
  },
  farmacia_privada: {
    code: "FARM",
    label: "Farmácia",
    color: "#2E9B7A",
    tint: "#e2f4ee",
  },
  clinica: {
    code: "CE",
    label: "Clínica Especializada",
    color: "var(--ms-amber)",
    tint: "var(--ms-amber-tint)",
  },
  caps: {
    code: "CAPS",
    label: "Atenção Psicossocial",
    color: "#3E5FA8",
    tint: "#e7ecf7",
  },
  laboratorio: {
    code: "LAB",
    label: "Laboratório",
    color: "#5B6470",
    tint: "#e9ebee",
  },
};
