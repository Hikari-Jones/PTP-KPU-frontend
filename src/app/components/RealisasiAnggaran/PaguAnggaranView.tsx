import { useState } from "react"
import { Download, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function PaguAnggaranView({ theme, onNavigate }: { theme: "light" | "dark"; onNavigate?: (tab: string) => void }) {
  const isDark = theme === "dark"
  const [selectedTA, setSelectedTA] = useState("TA 2025")

  const paguData = [
    { program: "Program Penyelenggaraan Pemilu", pagu: 28500000000, realisasi: 19800000000, sisa: 8700000000, pct: 69.5 },
    { program: "Program Dukungan Manajemen & Teknis", pagu: 17280000000, realisasi: 11450000000, sisa: 5830000000, pct: 66.3 },
  ]

  const formatRupiah = (val: number) => "Rp " + new Intl.NumberFormat("id-ID").format(val)

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <button onClick={() => onNavigate && onNavigate("dashboard")} className="hover:text-red-500 cursor-pointer">
          Dashboard
        </button>
        <span>&gt;</span>
        <span>Anggaran</span>
        <span>&gt;</span>
        <span className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>Pagu Anggaran ({selectedTA})</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight my-0 ${isDark ? "text-white" : "text-black"}`}>
            Pagu Anggaran KPU Sulut
          </h1>
          <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>
            Alokasi Pagu Anggaran berdasarkan Program & DIPA {selectedTA}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedTA}
            onChange={(e) => setSelectedTA(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
              isDark ? "bg-[#0f172a] border-white/10 text-white" : "bg-white border-slate-300 text-black"
            }`}
          >
            <option value="TA 2025">TA 2025</option>
            <option value="TA 2026">TA 2026</option>
          </select>
          <button className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${isDark ? "bg-[#0f172a] border-white/10 text-gray-300" : "bg-white border-slate-200 text-slate-700"}`}>
            <Download className="w-4 h-4" />
            <span>Export DIPA</span>
          </button>
          <button className="btn-kpu-red px-4 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Penetapan Pagu</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paguData.map((p, idx) => (
          <Card key={idx} className={`rounded-2xl border ${isDark ? "bg-[#0f172a]/90 border-white/10" : "bg-white border-slate-200"}`}>
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>
                {p.program}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className={`text-xs ${isDark ? "text-gray-400" : "text-slate-600"}`}>Pagu DIPA:</span>
                <span className={`text-base font-black ${isDark ? "text-white" : "text-black"}`}>{formatRupiah(p.pagu)}</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-gray-400">Realisasi s.d Saat Ini:</span>
                <span className="font-mono font-bold text-red-500">{formatRupiah(p.realisasi)} ({p.pct}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full" style={{ width: `${p.pct}%` }}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
