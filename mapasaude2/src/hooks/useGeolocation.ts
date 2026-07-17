import { useCallback, useState } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocalização não é compatível com este navegador.");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("idle");
      },
      (err) => {
        setStatus("error");
        setErrorMessage(
          err.code === err.PERMISSION_DENIED
            ? "Permissão de localização negada."
            : "Não foi possível obter sua localização.",
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  return { location, status, errorMessage, locate };
}
