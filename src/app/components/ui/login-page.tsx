import React, { useState } from "react"
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"
import { Input } from "./input"
import { Button } from "./button"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("ahmad.kurniawan@kpu.go.id")
  const [password, setPassword] = useState("••••••••")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess()
    }, 600)
  }

  return (
    <div className="min-h-screen w-full bg-[#060a12] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-950/60 border border-red-400/30 mb-3">
            KPU
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight my-0">
            Sistem Informasi KPU Sulut
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Komisi Pemilihan Umum Provinsi Sulawesi Utara
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-[#1e293b] bg-[#0c1220]/90 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-lg font-semibold text-gray-100">
              Masuk ke Akun Anda
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Masukkan kredensial staf untuk mengakses dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 block">Email Instansi</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kpu.go.id"
                    className="pl-9 bg-[#111827] border-[#1e293b] text-xs focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300 block">Kata Sandi</label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-red-400 hover:underline">
                    Lupa sandi?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9 bg-[#111827] border-[#1e293b] text-xs focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-500" />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 text-xs transition-all mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Masuk Portal Operasional</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-0 flex flex-col gap-3">
            <div className="w-full border-t border-[#1e293b] pt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Koneksi Terenkripsi SSL - KPU Republik Indonesia</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
