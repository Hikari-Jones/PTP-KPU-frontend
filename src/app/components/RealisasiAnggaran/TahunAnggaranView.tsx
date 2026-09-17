import { useState } from "react"
import {
  CheckCircle2,
  Calendar,
  BarChart2,
  FileText,
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Lock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import type { TahunAnggaranItem } from "./types"

interface Props {
  theme: "light" | "dark"
  onNavigate?: (tab: string) => void
}

const INITIAL_TA: TahunAnggaranItem[] = [
  {
    id: "ta-2022",
    tahun: 2022,
    status: "Ditutup",
    tanggalMulai: "1 Jan 2022",
    tanggalSelesai: "31 Des 2022",
    deskripsi: "Tahun anggaran telah selesai dan ditutup",
    dibuatOleh: "Admin KPU",
  },
  {
    id: "ta-2023",
    tahun: 2023,
    status: "Ditutup",
    tanggalMulai: "1 Jan 2023",
    tanggalSelesai: "31 Des 2023",
    deskripsi: "Tahun anggaran telah selesai dan ditutup",
    dibuatOleh: "Admin KPU",
  },
  {
    id: "ta-2024",
    tahun: 2024,
    status: "Ditutup",
    tanggalMulai: "1 Jan 2024",
    tanggalSelesai: "31 Des 2024",
    deskripsi: "Tahun anggaran telah selesai dan ditutup",
    dibuatOleh: "Admin KPU",
  },
  {
    id: "ta-2025",
    tahun: 2025,
    status: "Aktif",
    tanggalMulai: "1 Jan 2025",
    tanggalSelesai: "31 Des 2025",
    deskripsi: "Tahun anggaran berjalan aktif",
    dibuatOleh: "Admin KPU",
  },
  {
    id: "ta-2026",
    tahun: 2026,
    status: "Draft",
    tanggalMulai: "1 Jan 2026",
    tanggalSelesai: "31 Des 2026",
    deskripsi: "Persiapan tahun anggaran 2026",
    dibuatOleh: "Admin KPU",
  },
]

export function TahunAnggaranView({ theme, onNavigate }: Props) {
  const isDark = theme === "dark"
  const [dataList, setDataList] = useState<TahunAnggaranItem[]>(INITIAL_TA)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Semua Status")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TahunAnggaranItem | null>(null)

  // New TA form state
  const [formTahun, setFormTahun] = useState(new Date().getFullYear() + 2)
  const [formStatus, setFormStatus] = useState<"Draft" | "Aktif" | "Ditutup">("Draft")
  const [formMulai, setFormMulai] = useState("01 Jan 2027")
  const [formSelesai, setFormSelesai] = useState("31 Des 2027")
  const [formDeskripsi, setFormDeskripsi] = useState("")

  const filteredData = dataList.filter((item) => {
    const matchSearch =
      item.tahun.toString().includes(searchQuery) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dibuatOleh.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === "Semua Status" || item.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: TahunAnggaranItem = {
      id: `ta-${formTahun}`,
      tahun: Number(formTahun),
      status: formStatus,
      tanggalMulai: formMulai,
      tanggalSelesai: formSelesai,
      deskripsi: formDeskripsi || `Tahun anggaran ${formTahun}`,
      dibuatOleh: "Admin KPU",
    }
    setDataList((prev) => [...prev, newItem])
    setIsModalOpen(false)
    setFormDeskripsi("")
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus tahun anggaran ini?")) {
      setDataList((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const handleExportExcel = () => {
    let csv = "Tahun,Status,Tanggal Mulai,Tanggal Selesai,Deskripsi,Dibuat Oleh\n"
    filteredData.forEach((row) => {
      csv += `"${row.tahun}","${row.status}","${row.tanggalMulai}","${row.tanggalSelesai}","${row.deskripsi}","${row.dibuatOleh}"\n`
    })
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Tahun_Anggaran_KPU_Sulut.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <button
          onClick={() => onNavigate && onNavigate("dashboard")}
          className="hover:text-red-500 cursor-pointer transition-colors"
        >
          Dashboard
        </button>
        <span>&gt;</span>
        <span>Master Data</span>
        <span>&gt;</span>
        <span className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>
          Tahun Anggaran
        </span>
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight my-0 ${isDark ? "text-white" : "text-black"}`}>
          Tahun Anggaran
        </h1>
        <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-400" : "text-slate-600"}`}>
          Kelola periode tahun anggaran yang digunakan dalam seluruh proses pengelolaan pagu, realisasi, dan laporan.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TAHUN AKTIF */}
        <Card className={`rounded-2xl border transition-all ${isDark ? "bg-[#0f172a]/90 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Tahun Aktif
              </p>
              <h3 className="text-2xl font-black text-emerald-400 tracking-tight my-0">
                2025
              </h3>
              <p className={`text-[11px] font-medium mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Sedang berjalan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: TOTAL TAHUN */}
        <Card className={`rounded-2xl border transition-all ${isDark ? "bg-[#0f172a]/90 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Total Tahun
              </p>
              <h3 className={`text-2xl font-black tracking-tight my-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                5 Tahun
              </h3>
              <p className={`text-[11px] font-medium mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Terdaftar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: STATUS SISTEM */}
        <Card className={`rounded-2xl border transition-all ${isDark ? "bg-[#0f172a]/90 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0 border border-red-500/30">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Status Sistem
              </p>
              <h3 className="text-2xl font-black text-red-500 tracking-tight my-0">
                Aktif
              </h3>
              <p className={`text-[11px] font-medium mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                TA 2025
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: TAHUN BERIKUTNYA */}
        <Card className={`rounded-2xl border transition-all ${isDark ? "bg-[#0f172a]/90 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Tahun Berikutnya
              </p>
              <h3 className="text-2xl font-black text-amber-400 tracking-tight my-0">
                2026
              </h3>
              <p className={`text-[11px] font-medium mt-0.5 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                Draft
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-slate-500"}`} />
            <input
              type="text"
              placeholder="Cari tahun anggaran.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-medium transition-colors ${
                isDark
                  ? "bg-[#0f172a] border-white/10 text-white placeholder-gray-500 focus:border-red-500"
                  : "bg-white border-slate-200 text-black placeholder-slate-400 focus:border-red-500 shadow-xs"
              }`}
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border outline-none font-bold cursor-pointer ${
              isDark
                ? "bg-[#0f172a] border-white/10 text-white focus:border-red-500"
                : "bg-white border-slate-200 text-black focus:border-red-500 shadow-xs"
            }`}
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Draft">Draft</option>
            <option value="Ditutup">Ditutup</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
              isDark
                ? "bg-[#0f172a] border-white/10 text-gray-300 hover:bg-[#1e293b] hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          {/* Tambah Tahun Anggaran Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-kpu-red px-4 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-red-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tahun Anggaran</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <Card className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#0f172a]/90 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className={isDark ? "border-b border-white/10 bg-[#0a0f1d]" : "border-b border-slate-200 bg-slate-50"}>
                <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-gray-400" : "text-slate-600"}`}>TAHUN</TableHead>
                <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-gray-400" : "text-slate-600"}`}>STATUS</TableHead>
                <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-gray-400" : "text-slate-600"}`}>TANGGAL MULAI</TableHead>
                <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-gray-400" : "text-slate-600"}`}>TANGGAL SELESAI</TableHead>
                <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-gray-400" : "text-slate-600"}`}>DESKRIPSI</TableHead>
                <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-gray-400" : "text-slate-600"}`}>DIBUAT OLEH</TableHead>
                <TableHead className={`text-[11px] font-extrabold uppercase text-center ${isDark ? "text-gray-400" : "text-slate-600"}`}>AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-gray-400">
                    Tidak ada data tahun anggaran ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`border-b transition-colors ${
                      isDark ? "border-white/5 hover:bg-white/[0.03]" : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <TableCell className="font-mono text-sm font-black text-blue-400">
                      {row.tahun}
                    </TableCell>
                    <TableCell>
                      {row.status === "Aktif" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Aktif
                        </span>
                      )}
                      {row.status === "Draft" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Draft
                        </span>
                      )}
                      {row.status === "Ditutup" && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-500/15 text-gray-400 border border-white/10">
                          Ditutup
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                      {row.tanggalMulai}
                    </TableCell>
                    <TableCell className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                      {row.tanggalSelesai}
                    </TableCell>
                    <TableCell className={`text-xs font-medium max-w-xs truncate ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                      {row.deskripsi}
                    </TableCell>
                    <TableCell className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                      {row.dibuatOleh}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedItem(row)}
                          title="Lihat Detail"
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(row)
                            setIsModalOpen(true)
                          }}
                          title="Edit"
                          className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {row.status === "Ditutup" ? (
                          <span title="Tahun anggaran terkunci" className="p-1.5 text-gray-500">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDelete(row.id)}
                            title="Hapus"
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Table Footer / Pagination */}
          <div className={`p-4 flex items-center justify-between text-xs border-t ${
            isDark ? "border-white/10 text-gray-400" : "border-slate-200 text-slate-600"
          }`}>
            <span>
              Menampilkan 1-{filteredData.length} dari {filteredData.length} data
            </span>
            <div className="flex items-center gap-1.5">
              <button className="p-1 rounded-lg border border-white/10 opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </span>
              <button className="p-1 rounded-lg border border-white/10 opacity-50 cursor-not-allowed">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Tambah / Edit Tahun Anggaran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
            isDark ? "bg-[#0f172a] border-white/10 text-white" : "bg-white border-slate-200 text-black"
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? "border-white/10 bg-[#0a0f1d]" : "border-slate-200 bg-slate-50"
            }`}>
              <h3 className="text-sm font-bold">
                {selectedItem ? "Edit Tahun Anggaran" : "Tambah Tahun Anggaran Baru"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedItem(null)
                }}
                className="p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tahun Anggaran</label>
                <input
                  type="number"
                  required
                  value={formTahun}
                  onChange={(e) => setFormTahun(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-bold ${
                    isDark ? "bg-[#131b2e] border-white/10 text-white focus:border-red-500" : "bg-slate-50 border-slate-300 text-black focus:border-red-500"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-bold ${
                    isDark ? "bg-[#131b2e] border-white/10 text-white focus:border-red-500" : "bg-slate-50 border-slate-300 text-black focus:border-red-500"
                  }`}
                >
                  <option value="Draft">Draft</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Ditutup">Ditutup</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal Mulai</label>
                  <input
                    type="text"
                    value={formMulai}
                    onChange={(e) => setFormMulai(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? "bg-[#131b2e] border-white/10 text-white focus:border-red-500" : "bg-slate-50 border-slate-300 text-black focus:border-red-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tanggal Selesai</label>
                  <input
                    type="text"
                    value={formSelesai}
                    onChange={(e) => setFormSelesai(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? "bg-[#131b2e] border-white/10 text-white focus:border-red-500" : "bg-slate-50 border-slate-300 text-black focus:border-red-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi / Keterangan</label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Deskripsi kegiatan tahun anggaran..."
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? "bg-[#131b2e] border-white/10 text-white focus:border-red-500" : "bg-slate-50 border-slate-300 text-black focus:border-red-500"
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedItem(null)
                  }}
                  className={`px-4 py-2 rounded-xl border font-bold cursor-pointer ${
                    isDark ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-kpu-red px-5 py-2 text-white font-bold rounded-xl cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
