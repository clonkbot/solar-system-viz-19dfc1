import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { SolarSystem } from "./components/SolarSystem";
import { AuthForm } from "./components/AuthForm";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-xl opacity-50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative flex flex-col">
      {/* Starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Nebula effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-cyan-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-red-500" />
              <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 blur-md opacity-60" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-purple-400">
                СОЛНЕЧНАЯ СИСТЕМА
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => signOut()}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-300 hover:bg-white/5"
              >
                Выйти
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 pb-16">
        <SolarSystem />
      </main>

      {/* Auth Modal */}
      {showAuth && !isAuthenticated && (
        <AuthForm onClose={() => setShowAuth(false)} />
      )}

      {/* Footer */}
      <footer className="relative z-20 py-4 sm:py-6 text-center">
        <p className="text-[10px] sm:text-xs text-white/30 tracking-wide font-light">
          Requested by <span className="text-white/40">@web-user</span> · Built by <span className="text-white/40">@clonkbot</span>
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }

        body {
          font-family: 'Outfit', sans-serif;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 20px currentColor); }
          50% { filter: brightness(1.2) drop-shadow(0 0 40px currentColor); }
        }
      `}</style>
    </div>
  );
}
