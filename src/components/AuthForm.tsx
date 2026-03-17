import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

interface AuthFormProps {
  onClose: () => void;
}

export function AuthForm({ onClose }: AuthFormProps) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
      onClose();
    } catch (err) {
      setError(flow === "signIn" ? "Неверный email или пароль" : "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
      onClose();
    } catch (err) {
      setError("Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-white mb-2">
            {flow === "signIn" ? "Добро пожаловать" : "Создать аккаунт"}
          </h2>
          <p className="text-white/50 text-xs sm:text-sm">
            {flow === "signIn" ? "Войдите для сохранения прогресса" : "Исследуйте космос вместе с нами"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Пароль"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
            />
          </div>
          <input name="flow" type="hidden" value={flow} />

          {error && (
            <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium text-white hover:from-purple-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 text-sm sm:text-base"
          >
            {isLoading ? "Загрузка..." : flow === "signIn" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs sm:text-sm">или</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Anonymous */}
        <button
          onClick={handleAnonymous}
          disabled={isLoading}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
        >
          Продолжить как гость
        </button>

        {/* Toggle flow */}
        <p className="text-center mt-6 text-white/50 text-xs sm:text-sm">
          {flow === "signIn" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            type="button"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {flow === "signIn" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}
