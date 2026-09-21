import { Construction } from "lucide-react"
import { Card, CardContent } from "../ui/card"

interface Props {
  theme: "light" | "dark"
  onNavigate?: (tab: string) => void
}

export function SatkerView({ theme, onNavigate }: Props) {
  const isDark = theme === "dark"

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Realisasi Anggaran
          </p>
          <h1 className={`text-xl font-bold tracking-tight my-0 ${isDark ? "text-white" : "text-black"}`}>
            Satker
          </h1>
          <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
            Pengelolaan Data Satuan Kerja KPU Provinsi dan Kabupaten/Kota
          </p>
        </div>
      </div>

      {/* Placeholder Card: Fitur dalam pengembangan */}
      <Card
        className={`relative overflow-hidden ${
          isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"
        } backdrop-blur-md shadow-lg rounded-2xl`}
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
          <div className="w-20 h-20 rounded-3xl bg-red-600/15 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shadow-lg">
            <Construction className="w-10 h-10 animate-bounce" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Fitur dalam Pengembangan
            </h2>
            <p className={`text-xs ${isDark ? "text-gray-300" : "text-slate-600"} leading-relaxed`}>
              Modul manajemen Satuan Kerja (Satker) KPU Provinsi Sulawesi Utara saat ini sedang dalam proses integrasi data DIPA Satker wilayah. Silakan gunakan modul Akun Anggaran dan Pagu Anggaran.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate("realization-akun")}
              className="btn-kpu-red px-4 py-2 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
            >
              Buka Akun Anggaran
            </button>
            <button
              onClick={() => onNavigate && onNavigate("realization-pagu")}
              className={`px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                isDark ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800" : "border-slate-300 bg-white text-black hover:bg-slate-50"
              }`}
            >
              Buka Pagu Anggaran
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
