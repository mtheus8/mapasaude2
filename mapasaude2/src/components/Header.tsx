import { MapPinned, Navigation, Search, X } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
  onLocate: () => void;
  locateStatus: "idle" | "loading" | "error";
}

export function Header({
  query,
  onQueryChange,
  resultCount,
  onLocate,
  locateStatus,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ background: "var(--ms-blue)" }}
      className="text-white"
    >
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 sm:px-6">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border-2 border-white/80"
          aria-hidden
        >
          <MapPinned size={18} strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <h1
            className="text-2xl sm:text-[28px] font-bold tracking-wide uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MapsSaúde
          </h1>
          <p className="text-[11px] sm:text-xs text-white/75 -mt-0.5">
            Localizador de unidades de saúde e farmácias
          </p>
        </div>
        <div className="ml-auto hidden sm:block text-right">
          <span
            className="font-mono text-xs text-white/70 block"
            aria-live="polite"
          >
            {resultCount} {resultCount === 1 ? "unidade encontrada" : "unidades encontradas"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3 sm:px-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ms-ink-soft)]"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Buscar por nome, bairro ou serviço…"
            className="w-full rounded-[4px] border-0 bg-white py-2.5 pl-9 pr-9 text-sm text-[var(--ms-ink)] placeholder:text-[var(--ms-ink-soft)] outline-none ring-2 ring-transparent focus:ring-[var(--ms-coral)]"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              aria-label="Limpar busca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ms-ink-soft)] hover:text-[var(--ms-ink)]"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={onLocate}
          className="flex shrink-0 items-center gap-1.5 rounded-[4px] border-2 border-white/70 bg-white/10 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-60"
          disabled={locateStatus === "loading"}
        >
          <Navigation
            size={15}
            className={locateStatus === "loading" ? "animate-pulse" : ""}
          />
          <span className="hidden sm:inline">
            {locateStatus === "loading" ? "Localizando…" : "Minha localização"}
          </span>
        </button>
      </div>
    </motion.header>
  );
}
