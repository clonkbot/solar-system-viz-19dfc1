import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { PlanetDetail } from "./PlanetDetail";
import { Id } from "../../convex/_generated/dataModel";

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

export function SolarSystem() {
  const { isAuthenticated } = useConvexAuth();
  const bodies = useQuery(api.celestialBodies.list);
  const seed = useMutation(api.celestialBodies.seed);
  const stats = useQuery(api.explorations.getStats);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [viewMode, setViewMode] = useState<"orbit" | "list">("orbit");
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    if (bodies !== undefined && bodies.length === 0) {
      seed();
    }
  }, [bodies, seed]);

  if (bodies === undefined) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white/50">Загрузка солнечной системы...</div>
      </div>
    );
  }

  const sun = bodies.find((b: CelestialBody) => b.type === "star");
  const planets = bodies.filter((b: CelestialBody) => b.type === "planet").sort((a: CelestialBody, b: CelestialBody) => a.distanceFromSun - b.distanceFromSun);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setViewMode("orbit")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-all ${
              viewMode === "orbit"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            Орбиты
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            Список
          </button>
        </div>

        {isAuthenticated && stats && (
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white/40">Посещений:</span>
              <span className="text-amber-400 font-medium">{stats.totalVisits}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/40">Планет:</span>
              <span className="text-purple-400 font-medium">{stats.uniquePlanets}/9</span>
            </div>
          </div>
        )}

        {viewMode === "orbit" && (
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs sm:text-sm hidden sm:inline">Скорость:</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={timeScale}
              onChange={(e) => setTimeScale(parseFloat(e.target.value))}
              className="w-20 sm:w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
            />
            <span className="text-white/60 text-xs w-8">{timeScale}x</span>
          </div>
        )}
      </div>

      {viewMode === "orbit" ? (
        <OrbitalView
          sun={sun!}
          planets={planets}
          onSelect={setSelectedBody}
          timeScale={timeScale}
        />
      ) : (
        <ListView bodies={bodies} onSelect={setSelectedBody} />
      )}

      {selectedBody && (
        <PlanetDetail
          body={selectedBody}
          onClose={() => setSelectedBody(null)}
        />
      )}
    </div>
  );
}

function OrbitalView({
  sun,
  planets,
  onSelect,
  timeScale
}: {
  sun: CelestialBody;
  planets: CelestialBody[];
  onSelect: (body: CelestialBody) => void;
  timeScale: number;
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.016 * timeScale);
    }, 16);
    return () => clearInterval(interval);
  }, [timeScale]);

  // Calculate sizes and distances for visualization
  const getOrbitRadius = (index: number) => {
    const minRadius = 60;
    const maxRadius = Math.min(280, window.innerWidth / 2 - 40);
    return minRadius + (index * (maxRadius - minRadius)) / (planets.length);
  };

  const getPlanetSize = (diameter: number) => {
    if (diameter > 100000) return 18;
    if (diameter > 40000) return 14;
    if (diameter > 10000) return 10;
    return 7;
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Sun */}
      <button
        onClick={() => onSelect(sun)}
        className="absolute z-20 group"
        style={{
          width: 50,
          height: 50,
        }}
      >
        <div
          className="w-full h-full rounded-full transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 30% 30%, #fff5d4, ${sun.color}, #c75000)`,
            boxShadow: `0 0 60px ${sun.color}, 0 0 100px ${sun.color}80, 0 0 140px ${sun.color}40`,
          }}
        />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {sun.name}
        </span>
      </button>

      {/* Orbits and planets */}
      {planets.map((planet, index) => {
        const orbitRadius = getOrbitRadius(index);
        const planetSize = getPlanetSize(planet.diameter);
        const speed = 0.02 / Math.sqrt(planet.distanceFromSun || 1);
        const angle = time * speed + (index * Math.PI / 4);
        const x = Math.cos(angle) * orbitRadius;
        const y = Math.sin(angle) * orbitRadius * 0.4; // Elliptical orbit

        return (
          <div key={planet._id}>
            {/* Orbit path */}
            <div
              className="absolute border border-white/10 rounded-full pointer-events-none"
              style={{
                width: orbitRadius * 2,
                height: orbitRadius * 0.8,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Planet */}
            <button
              onClick={() => onSelect(planet)}
              className="absolute z-10 group transition-transform duration-200 hover:scale-150"
              style={{
                width: planetSize,
                height: planetSize,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="w-full h-full rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.color}ee, ${planet.color}, ${planet.color}88)`,
                  boxShadow: `0 0 ${planetSize}px ${planet.color}80`,
                }}
              >
                {/* Rings for Saturn, Uranus, Neptune */}
                {planet.rings && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
                    style={{
                      width: planetSize * 2.2,
                      height: planetSize * 0.6,
                      transform: "translate(-50%, -50%) rotateX(70deg)",
                    }}
                  />
                )}
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                {planet.name}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ListView({
  bodies,
  onSelect
}: {
  bodies: CelestialBody[];
  onSelect: (body: CelestialBody) => void;
}) {
  const sortedBodies = [...bodies].sort((a, b) => a.distanceFromSun - b.distanceFromSun);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {sortedBodies.map((body, index) => (
          <button
            key={body._id}
            onClick={() => onSelect(body)}
            className="group p-4 sm:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 text-left"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: body.type === "star"
                    ? `radial-gradient(circle at 30% 30%, #fff5d4, ${body.color}, #c75000)`
                    : `radial-gradient(circle at 30% 30%, ${body.color}ee, ${body.color})`,
                  boxShadow: `0 0 20px ${body.color}60`,
                }}
              />
              <div className="min-w-0">
                <h3 className="font-display font-medium text-white group-hover:text-amber-200 transition-colors text-sm sm:text-base truncate">
                  {body.name}
                </h3>
                <p className="text-white/40 text-xs sm:text-sm">
                  {body.type === "star" ? "Звезда" : `${body.distanceFromSun} AU`}
                </p>
              </div>
            </div>
            <p className="mt-3 text-white/50 text-xs sm:text-sm line-clamp-2">
              {body.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
