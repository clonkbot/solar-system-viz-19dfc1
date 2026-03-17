import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface CelestialBody {
  _id: Id<"celestialBodies">;
  name: string;
  type: "star" | "planet" | "dwarf_planet" | "moon";
  distanceFromSun: number;
  orbitalPeriod: number;
  diameter: number;
  color: string;
  description: string;
  rings?: boolean;
  moons?: number;
}

interface PlanetDetailProps {
  body: CelestialBody;
  onClose: () => void;
}

export function PlanetDetail({ body, onClose }: PlanetDetailProps) {
  const { isAuthenticated } = useConvexAuth();
  const isFavorite = useQuery(api.favorites.isFavorite, { bodyId: body._id });
  const toggleFavorite = useMutation(api.favorites.toggle);
  const visitPlanet = useMutation(api.explorations.visit);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [visited, setVisited] = useState(false);

  const handleVisit = async () => {
    await visitPlanet({ bodyId: body._id, notes: notes || undefined });
    setVisited(true);
    setShowNotes(false);
    setNotes("");
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("ru-RU");
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "star": return "Звезда";
      case "planet": return "Планета";
      case "dwarf_planet": return "Карликовая планета";
      case "moon": return "Спутник";
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        {/* Header with planet visualization */}
        <div
          className="relative h-40 sm:h-48 flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{
            background: `radial-gradient(circle at 50% 120%, ${body.color}30, transparent 70%)`,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white bg-black/20 rounded-full transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Planet sphere */}
          <div className="relative">
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full animate-spin"
              style={{
                background: body.type === "star"
                  ? `radial-gradient(circle at 30% 30%, #fff5d4, ${body.color}, #c75000)`
                  : `radial-gradient(circle at 30% 30%, ${body.color}ee, ${body.color}, ${body.color}88)`,
                boxShadow: `0 0 60px ${body.color}80, 0 0 100px ${body.color}40`,
                animationDuration: "20s",
              }}
            />
            {/* Rings */}
            {body.rings && (
              <div
                className="absolute top-1/2 left-1/2 rounded-full border-2 border-white/30 pointer-events-none"
                style={{
                  width: 160,
                  height: 40,
                  transform: "translate(-50%, -50%) rotateX(70deg)",
                }}
              />
            )}
          </div>

          {/* Favorite button */}
          {isAuthenticated && (
            <button
              onClick={() => toggleFavorite({ bodyId: body._id })}
              className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-all"
            >
              <svg
                className={`w-5 h-5 transition-colors ${isFavorite ? "text-amber-400 fill-amber-400" : "text-white/40"}`}
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          )}
        </div>

        {/* Content - scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="text-center mb-4 sm:mb-6">
            <span className="inline-block px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider text-white/50 bg-white/5 rounded-full mb-2">
              {getTypeLabel(body.type)}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              {body.name}
            </h2>
          </div>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 text-center">
            {body.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Диаметр</p>
              <p className="text-white font-display text-base sm:text-lg font-medium">
                {formatNumber(body.diameter)} <span className="text-white/50 text-xs sm:text-sm">км</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-1">От Солнца</p>
              <p className="text-white font-display text-base sm:text-lg font-medium">
                {body.distanceFromSun} <span className="text-white/50 text-xs sm:text-sm">AU</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Орбита</p>
              <p className="text-white font-display text-base sm:text-lg font-medium">
                {formatNumber(body.orbitalPeriod)} <span className="text-white/50 text-xs sm:text-sm">дней</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 sm:p-4">
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Спутники</p>
              <p className="text-white font-display text-base sm:text-lg font-medium">
                {body.moons ?? "—"}
              </p>
            </div>
          </div>

          {/* Visit button for authenticated users */}
          {isAuthenticated && (
            <div className="space-y-3">
              {!showNotes && !visited && (
                <button
                  onClick={() => setShowNotes(true)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium text-white hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/25 text-sm sm:text-base"
                >
                  Посетить {body.name}
                </button>
              )}

              {showNotes && (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Заметки о посещении (необязательно)..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none h-20 text-sm"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNotes(false)}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 transition-all text-sm"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleVisit}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium text-white hover:from-purple-400 hover:to-blue-400 transition-all text-sm"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              )}

              {visited && (
                <div className="text-center py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <span className="text-green-400 text-sm">Посещение записано!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
