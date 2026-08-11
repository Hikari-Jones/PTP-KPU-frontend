import React, { useState } from "react"
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sun, Moon, AlertCircle, ShieldAlert, UserCheck } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface LoginFormProps {
  theme?: "light" | "dark"
  onToggleTheme?: () => void
}

export function LoginForm({ theme = "light", onToggleTheme }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("ahmad.kurniawan@kpu.go.id")
  const [password, setPassword] = useState("123456")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    setTimeout(() => {
      const res = login(email, password)
      setIsLoading(false)
      if (!res.success) {
        setErrorMessage(res.error || "Email/Kata Sandi Tidak Valid")
      }
    }, 400)
  }

  const handleSelectDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setErrorMessage(null)
  }

  const isDark = theme === "dark"

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-[#060a12] text-gray-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Background Decorative Glow Effects */}
      {isDark ? (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-300/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        </>
      )}

      {/* Theme Toggle Button at top right */}
      {onToggleTheme && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium cursor-pointer shadow-sm ${
              isDark
                ? "border-slate-800 bg-[#0d1424] text-amber-400 hover:bg-[#152038]"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
            title="Ganti Tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="hidden sm:inline">{isDark ? "Mode Terang" : "Mode Gelap"}</span>
          </button>
        </div>
      )}

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-950/40 border border-red-400/30 mb-3">
            KPU
          </div>
          <h1 className={`text-2xl font-extrabold tracking-tight my-0 ${isDark ? "text-white" : "text-slate-900"}`}>
            Sistem Informasi KPU Sulut
          </h1>
          <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            Platform Terpadu Penunjang KPU (PTP-KPU)
          </p>
        </div>

        {/* Login Card */}
        <Card
          className={`shadow-2xl transition-colors duration-300 ${
            isDark
              ? "border-[#1e293b] bg-[#0c1220]/90 text-gray-100"
              : "border-slate-200 bg-white/95 text-slate-800 shadow-slate-300/50"
          }`}
        >
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-slate-800"}`}>
              Masuk ke Akun Anda
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Badge / Toast Notification */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Demo Quick Selector */}
            <div className="p-3 rounded-xl border border-dashed border-red-500/30 bg-red-500/5 text-xs space-y-1.5">
              <span className="font-bold text-[11px] uppercase tracking-wider block text-red-600 dark:text-red-400">
                Uji Coba Kredensial (Klik untuk isi):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemo("admin@kpu.go.id", "admin123")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 cursor-pointer transition-all ${
                    email === "admin@kpu.go.id"
                      ? "bg-red-600 text-white border-red-600"
                      : isDark
                      ? "border-[#1e293b] bg-[#111827] text-gray-300 hover:border-red-500/50"
                      : "border-slate-300 bg-white text-slate-700 hover:border-red-500/50"
                  }`}
                >
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span>Role Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemo("ahmad.kurniawan@kpu.go.id", "123456")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 cursor-pointer transition-all ${
                    email === "ahmad.kurniawan@kpu.go.id"
                      ? "bg-red-600 text-white border-red-600"
                      : isDark
                      ? "border-[#1e293b] bg-[#111827] text-gray-300 hover:border-red-500/50"
                      : "border-slate-300 bg-white text-slate-700 hover:border-red-500/50"
                  }`}
                >
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Role Operator</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className={`text-xs font-medium block ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                  Email Instansi
                </label>
                <div className="relative">
                  <Mail
                    className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-400" : "text-slate-400"
                    }`}
                  />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kpu.go.id"
                    className={`pl-9 text-xs focus:border-red-500 ${
                      isDark
                        ? "bg-[#111827] border-[#1e293b] text-gray-100"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-medium block ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                    Kata Sandi
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] text-red-600 hover:text-red-500 hover:underline font-medium"
                  >
                    Lupa sandi?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-400" : "text-slate-400"
                    }`}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pl-9 pr-9 text-xs focus:border-red-500 ${
                      isDark
                        ? "bg-[#111827] border-[#1e293b] text-gray-100"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-gray-400 hover:text-white" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label
                  className={`flex items-center gap-2 cursor-pointer ${isDark ? "text-gray-400" : "text-slate-600"}`}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-400 bg-white text-red-600 focus:ring-red-500"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-xs transition-all mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Memverifikasi kredensial...</span>
                ) : (
                  <>
                    <span>Masuk Portal Operasional</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
