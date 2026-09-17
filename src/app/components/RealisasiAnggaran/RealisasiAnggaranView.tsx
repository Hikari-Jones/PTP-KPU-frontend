import { useState } from "react"
import {
  TrendingUp,
  FileText,
  Filter,
  Search,
  Plus,
  FileSpreadsheet,
  Wallet,
  Layers,
  PieChart,
  FileCheck,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import type { AkunAnggaran, TransaksiRealisasi } from "./types"
import { TambahRealisasiModal } from "./TambahRealisasiModal"
import { LaporanBulananModal } from "./LaporanBulananModal"

export type RealisasiSubTab = "ringkasan" | "transaksi" | "laporan" | "verifikasi"

interface Props {
  theme: "light" | "dark"
  subTab?: RealisasiSubTab
  onNavigate?: (tab: string) => void
}

interface MonthlyData {
  bulan: string
  shortBulan: string
  realisasi: number // in Miliar (e.g. 1.25)
  target: number // in Miliar (e.g. 3.81)
  isCompleted: boolean
}

const MONTHLY_TREND_DATA: MonthlyData[] = [
  { bulan: "Januari", shortBulan: "Jan", realisasi: 1.25, target: 3.81, isCompleted: true },
  { bulan: "Februari", shortBulan: "Feb", realisasi: 3.82, target: 3.81, isCompleted: true },
  { bulan: "Maret", shortBulan: "Mar", realisasi: 2.30, target: 3.81, isCompleted: true },
  { bulan: "April", shortBulan: "Apr", realisasi: 4.40, target: 3.81, isCompleted: true },
  { bulan: "Mei", shortBulan: "Mei", realisasi: 2.15, target: 3.81, isCompleted: true },
  { bulan: "Juni", shortBulan: "Jun", realisasi: 4.90, target: 3.81, isCompleted: true },
  { bulan: "Juli", shortBulan: "Jul", realisasi: 1.85, target: 3.81, isCompleted: true },
  { bulan: "Agustus", shortBulan: "Agu", realisasi: 4.70, target: 3.81, isCompleted: true },
  { bulan: "September", shortBulan: "Sep", realisasi: 2.70, target: 3.81, isCompleted: true },
  { bulan: "Oktober", shortBulan: "Okt", realisasi: 0.00, target: 3.81, isCompleted: false },
  { bulan: "November", shortBulan: "Nov", realisasi: 0.00, target: 3.81, isCompleted: false },
  { bulan: "Desember", shortBulan: "Des", realisasi: 0.00, target: 3.81, isCompleted: false },
]

interface DivisiSerapan {
  id: string
  nama: string
  realisasi: number
  pagu: number
  pct: number
}

const SERAPAN_DIVISI_DATA: DivisiSerapan[] = [
  { id: "keuangan", nama: "Keuangan & Umum", realisasi: 10.36, pagu: 14.80, pct: 70 },
  { id: "teknis", nama: "Teknis Penyelenggaraan", realisasi: 9.67, pagu: 12.40, pct: 78 },
  { id: "sdm", nama: "Sosialisasi & SDM", realisasi: 5.89, pagu: 9.20, pct: 64 },
  { id: "rendatin", nama: "Perencanaan & Data", realisasi: 5.17, pagu: 7.60, pct: 68 },
  { id: "hukum", nama: "Hukum & Pengawasan", realisasi: 3.76, pagu: 5.78, pct: 65 },
]

interface TopAkunItem {
  rank: number
  nama: string
  amount: string
  pct: number
}

const TOP_AKUN_DATA: TopAkunItem[] = [
  { rank: 1, nama: "Belanja Gaji dan Tunjangan", amount: "Rp 6.38 M", pct: 75 },
  { rank: 2, nama: "Belanja Jasa", amount: "Rp 5.46 M", pct: 70 },
  { rank: 3, nama: "Belanja Barang Non Operasional", amount: "Rp 4.22 M", pct: 65 },
  { rank: 4, nama: "Belanja Perjalanan Dinas", amount: "Rp 3.15 M", pct: 75 },
  { rank: 5, nama: "Belanja Barang Operasional", amount: "Rp 2.88 M", pct: 60 },
  { rank: 6, nama: "Belanja Modal Gedung", amount: "Rp 2.76 M", pct: 55 },
]

const INITIAL_REALISASI_TERBARU = [
  {
    id: "RT-01",
    noDokumen: "SK-018/KPU-SULUT/2025",
    tanggal: "2025-01-15",
    namaAkun: "Belanja Modal Gedung",
    kodeAkun: "5321",
    divisi: "Div. Sosialisasi, Pendi...",
    jumlah: 2760000000,
  },
  {
    id: "RT-02",
    noDokumen: "SK-017/KPU-SULUT/2025",
    tanggal: "2025-01-15",
    namaAkun: "Belanja Modal Peralatan",
    kodeAkun: "5311",
    divisi: "Div. Keuangan, Umum,...",
    jumlah: 2576000000,
  },
  {
    id: "RT-03",
    noDokumen: "SK-016/KPU-SULUT/2025",
    tanggal: "2025-01-15",
    namaAkun: "Belanja Jasa",
    kodeAkun: "5251",
    divisi: "Div. Perencanaan, Dat...",
    jumlah: 5460000000,
  },
  {
    id: "RT-04",
    noDokumen: "SK-015/KPU-SULUT/2025",
    tanggal: "2025-01-15",
    namaAkun: "Belanja Perjalanan Dinas",
    kodeAkun: "5241",
    divisi: "Div. Hukum dan Penga...",
    jumlah: 3150000000,
  },
  {
    id: "RT-05",
    noDokumen: "SK-014/KPU-SULUT/2025",
    tanggal: "2025-01-15",
    namaAkun: "Belanja Pemeliharaan",
    kodeAkun: "5231",
    divisi: "Div. Sosialisasi, Pendi...",
    jumlah: 1260000000,
  },
]

const INITIAL_TRANSAKSI_FIGMA: TransaksiRealisasi[] = [
  {
    id: "TRX-001",
    tanggal: "2025-09-28",
    noDokumen: "001/SPM-KPU/2025",
    kodeAkun: "521111",
    namaAkun: "Belanja Operasional Kantor",
    subbagian: "Keuangan & Umum",
    usulanKegiatan: "Pengadaan Alat Tulis & Konsumsi Rapat Operasional",
    jumlah: 150000000,
    buktiFile: "SPM_001_Operasional.pdf",
    status: "Disetujui",
    periode: "September 2025",
  },
  {
    id: "TRX-002",
    tanggal: "2025-09-25",
    noDokumen: "002/SPM-KPU/2025",
    kodeAkun: "521211",
    namaAkun: "Pengadaan Logistik Pilkada",
    subbagian: "Teknis Penyelenggaraan",
    usulanKegiatan: "Honorarium Panitia PPK & PPS Kabupaten Minahasa",
    jumlah: 85000000,
    buktiFile: "Honor_PPK_Minahasa.pdf",
    status: "Disetujui",
    periode: "September 2025",
  },
  {
    id: "TRX-003",
    tanggal: "2025-09-20",
    noDokumen: "003/SPM-KPU/2025",
    kodeAkun: "524111",
    namaAkun: "Sosialisasi Pemilih",
    subbagian: "Sosialisasi & SDM",
    usulanKegiatan: "Sewa Gedung Rapat Koordinasi Tahapan Pilkada",
    jumlah: 45000000,
    buktiFile: "Kwitansi_Sewa_Gedung.pdf",
    status: "Menunggu Verifikasi",
    periode: "September 2025",
  },
  {
    id: "TRX-004",
    tanggal: "2025-09-15",
    noDokumen: "004/SPM-KPU/2025",
    kodeAkun: "522112",
    namaAkun: "Perjalanan Dinas Pimpinan",
    subbagian: "Hukum & Pengawasan",
    usulanKegiatan: "Perjalanan Dinas Pengawasan Logistik ke Kepulauan",
    jumlah: 27500000,
    buktiFile: "SPD_Pengawasan_Logistik.pdf",
    status: "Disetujui",
    periode: "September 2025",
  },
  {
    id: "TRX-005",
    tanggal: "2025-09-10",
    noDokumen: "005/SPM-KPU/2025",
    kodeAkun: "521213",
    namaAkun: "Pemeliharaan Perangkat Server",
    subbagian: "Perencanaan & Data",
    usulanKegiatan: "Upgrade Storage & Cloud Server Sidalih TA 2025",
    jumlah: 62000000,
    buktiFile: "Faktur_Server_Sidalih.pdf",
    status: "Disetujui",
    periode: "September 2025",
  }
]

const INITIAL_AKUN: AkunAnggaran[] = [
  { kode: "521111", nama: "Belanja Operasional Kantor & Perjalanan Dinas", pagu: 14800000000, realisasi: 10360000000, sisa: 4440000000, divisi: "Keuangan & Umum" },
  { kode: "521211", nama: "Pengadaan Logistik & Kotak Suara Pilkada", pagu: 12400000000, realisasi: 9670000000, sisa: 2730000000, divisi: "Teknis Penyelenggaraan" },
  { kode: "522112", nama: "Honorarium Panitia Pemilihan (PPK & PPS)", pagu: 9200000000, realisasi: 5890000000, sisa: 3310000000, divisi: "Sosialisasi & SDM" },
  { kode: "524111", nama: "Sosialisasi & Edukasi Pemilih Pemula", pagu: 7600000000, realisasi: 5170000000, sisa: 2430000000, divisi: "Perencanaan & Data" },
  { kode: "526115", nama: "Bantuan Hukum & Sengketa Pemilu", pagu: 5780000000, realisasi: 3760000000, sisa: 2020000000, divisi: "Hukum & Pengawasan" },
]

export function RealisasiAnggaranView({ theme, subTab = "ringkasan", onNavigate }: Props) {
  const isDark = theme === "dark"

  const [akunList] = useState<AkunAnggaran[]>(INITIAL_AKUN)
  const [transaksiList, setTransaksiList] = useState<TransaksiRealisasi[]>(INITIAL_TRANSAKSI_FIGMA)

  // Top Filter Bar State
  const [selectedTA, setSelectedTA] = useState("TA 2025")
  const [selectedDivisi, setSelectedDivisi] = useState("Semua Divisi")
  const [selectedProgram, setSelectedProgram] = useState("Semua Program")
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-09-30")

  // Subtab Transaksi filters
  const [filterSubbagian, setFilterSubbagian] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLaporanOpen, setIsLaporanOpen] = useState(false)

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val)
  }

  const handleSaveRealisasi = (
    newTrxData: Omit<TransaksiRealisasi, "id">,
    _saveType: "Draft" | "Menunggu Verifikasi"
  ) => {
    const newTrx: TransaksiRealisasi = {
      ...newTrxData,
      id: `TRX-${Math.floor(100 + Math.random() * 900)}`,
    }
    setTransaksiList((prev) => [newTrx, ...prev])
  }

  // Filtered transactions for "transaksi" tab
  const filteredTransactions = transaksiList.filter((item) => {
    const matchesSub = filterSubbagian === "Semua" || item.subbagian.toLowerCase().includes(filterSubbagian.toLowerCase())
    const matchesSearch =
      item.noDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaAkun.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.usulanKegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodeAkun.includes(searchQuery)
    return matchesSub && matchesSearch
  })

  // Dynamic KPI numbers depending on selectedDivisi
  const getKPIData = () => {
    if (selectedDivisi === "Semua Divisi") {
      return {
        pagu: "45.78",
        realisasi: "31.25",
        sisa: "14.53",
        persentase: 68.3,
        target: 75.0,
        subtextRealisasi: "s.d. September 2025",
        terserapText: "68.3% terserap",
      }
    }
    const found = SERAPAN_DIVISI_DATA.find((d) => d.nama.toLowerCase().includes(selectedDivisi.toLowerCase()))
    if (found) {
      const sisa = (found.pagu - found.realisasi).toFixed(2)
      return {
        pagu: found.pagu.toFixed(2),
        realisasi: found.realisasi.toFixed(2),
        sisa,
        persentase: found.pct,
        target: 75.0,
        subtextRealisasi: `s.d. September 2025`,
        terserapText: `${found.pct}% terserap`,
      }
    }
    return {
      pagu: "45.78",
      realisasi: "31.25",
      sisa: "14.53",
      persentase: 68.3,
      target: 75.0,
      subtextRealisasi: "s.d. September 2025",
      terserapText: "68.3% terserap",
    }
  }

  const kpi = getKPIData()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Dynamic Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight my-0 ${isDark ? "text-white" : "text-black"}`}>
            Realisasi Anggaran {subTab === "ringkasan" && "— Overview"}
            {subTab === "transaksi" && "— Daftar Transaksi"}
            {subTab === "laporan" && "— Laporan Bulanan"}
            {subTab === "verifikasi" && "— Verifikasi Dokumen"}
          </h1>
          <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
            Portal Pemantauan & Transaksi Realisasi Anggaran PTP KPU Provinsi Sulawesi Utara
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-kpu-red px-4 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Realisasi</span>
          </button>

          <button
            onClick={() => setIsLaporanOpen(true)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm ${
              isDark
                ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                : "border-slate-300 bg-white text-black hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-red-600" />
            <span>Laporan Bulanan</span>
          </button>
        </div>
      </div>

      {/* Subtabs Quick Navigation */}
      <div className={`flex items-center gap-1.5 p-1 rounded-xl border w-fit overflow-x-auto max-w-full ${
        isDark ? "bg-[#131b2e] border-white/10" : "bg-slate-100 border-slate-300"
      }`}>
        {[
          { id: "ringkasan", label: "Overview" },
          { id: "transaksi", label: "Daftar Transaksi" },
          { id: "laporan", label: "Laporan Bulanan" },
          { id: "verifikasi", label: "Verifikasi Dokumen" },
        ].map((tab) => {
          const isActive = subTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate && onNavigate(tab.id === "ringkasan" ? "realization-summary" : `realization-${tab.id === "laporan" ? "reports" : tab.id}`)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-red-600 text-white shadow-sm"
                  : isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. RINGKASAN SUBTAB / DASHBOARD (PTP KPU THEME) */}
      {/* ========================================================================= */}
      {(subTab === "ringkasan" || !subTab) && (
        <div className="space-y-6">
          {/* Top Filter Area */}
          <div
            className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
              isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"
            } backdrop-blur-md shadow-lg`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* TA Dropdown */}
              <div className="relative">
                <select
                  value={selectedTA}
                  onChange={(e) => setSelectedTA(e.target.value)}
                  className={`appearance-none font-bold text-xs px-3.5 py-2 pr-8 rounded-xl border cursor-pointer ${
                    isDark
                      ? "bg-[#131b2e] border-[#1e293b] text-white hover:border-red-500"
                      : "bg-slate-50 border-slate-300 text-black hover:border-red-500"
                  }`}
                >
                  <option value="TA 2025">TA 2025</option>
                  <option value="TA 2026">TA 2026</option>
                  <option value="TA 2024">TA 2024</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>

              {/* Divisi Dropdown */}
              <div className="relative">
                <select
                  value={selectedDivisi}
                  onChange={(e) => setSelectedDivisi(e.target.value)}
                  className={`appearance-none font-bold text-xs px-3.5 py-2 pr-8 rounded-xl border cursor-pointer ${
                    isDark
                      ? "bg-[#131b2e] border-[#1e293b] text-white hover:border-red-500"
                      : "bg-slate-50 border-slate-300 text-black hover:border-red-500"
                  }`}
                >
                  <option value="Semua Divisi">Semua Divisi</option>
                  <option value="Keuangan & Umum">Keuangan & Umum</option>
                  <option value="Teknis Penyelenggaraan">Teknis Penyelenggaraan</option>
                  <option value="Sosialisasi & SDM">Sosialisasi & SDM</option>
                  <option value="Perencanaan & Data">Perencanaan & Data</option>
                  <option value="Hukum & Pengawasan">Hukum & Pengawasan</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>

              {/* Program Dropdown */}
              <div className="relative">
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className={`appearance-none font-bold text-xs px-3.5 py-2 pr-8 rounded-xl border cursor-pointer ${
                    isDark
                      ? "bg-[#131b2e] border-[#1e293b] text-white hover:border-red-500"
                      : "bg-slate-50 border-slate-300 text-black hover:border-red-500"
                  }`}
                >
                  <option value="Semua Program">Semua Program</option>
                  <option value="Program Penyelenggaraan Pemilu">Program Penyelenggaraan Pemilu</option>
                  <option value="Program Dukungan Manajemen">Program Dukungan Manajemen</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Date Range Picker Controls */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs outline-none font-semibold ${
                    isDark ? "bg-[#131b2e] border-[#1e293b] text-white" : "bg-slate-50 border-slate-300 text-black"
                  }`}
                />
              </div>

              <span className={isDark ? "text-gray-300" : "text-black"}>s/d</span>

              <div className="relative flex items-center">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs outline-none font-semibold ${
                    isDark ? "bg-[#131b2e] border-[#1e293b] text-white" : "bg-slate-50 border-slate-300 text-black"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 4 KPI Summary Cards (PTP KPU THEME: MERAH, HITAM, PUTIH) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: TOTAL PAGU ANGGARAN */}
            <Card className={`relative overflow-hidden transition-all ${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <CardContent className={`m-3 ml-4 p-4 rounded-xl border flex items-center justify-between min-h-[118px] ${isDark ? "bg-[#111827]/60 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex-1 flex flex-col justify-center">
                  <p className={`text-[11px] font-extrabold tracking-wider uppercase ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                    TOTAL PAGU ANGGARAN
                  </p>
                  <h2 className="text-2xl font-black mt-1 tracking-tight text-[#dc2626] dark:text-[#ef4444]">
                    Rp {kpi.pagu} M
                  </h2>
                  <p className={`text-[10px] font-bold mt-1 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                    {selectedTA} • Alokasi PTP
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Wallet className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TOTAL REALISASI */}
            <Card className={`relative overflow-hidden transition-all ${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <CardContent className={`m-3 ml-4 p-4 rounded-xl border flex items-center justify-between min-h-[118px] ${isDark ? "bg-[#111827]/60 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex-1 flex flex-col justify-center">
                  <p className={`text-[11px] font-extrabold tracking-wider uppercase ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                    TOTAL REALISASI
                  </p>
                  <h2 className="text-2xl font-black mt-1 tracking-tight text-[#dc2626] dark:text-[#ef4444]">
                    Rp {kpi.realisasi} M
                  </h2>
                  <p className={`text-[10px] font-bold flex items-center gap-1 mt-1 text-red-600 dark:text-red-400`}>
                    <TrendingUp className="w-3.5 h-3.5" /> {kpi.terserapText}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileCheck className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: SISA ANGGARAN */}
            <Card className={`relative overflow-hidden transition-all ${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <CardContent className={`m-3 ml-4 p-4 rounded-xl border flex items-center justify-between min-h-[118px] ${isDark ? "bg-[#111827]/60 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex-1 flex flex-col justify-center">
                  <p className={`text-[11px] font-extrabold tracking-wider uppercase ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                    SISA ANGGARAN
                  </p>
                  <h2 className="text-2xl font-black mt-1 tracking-tight text-[#dc2626] dark:text-[#ef4444]">
                    Rp {kpi.sisa} M
                  </h2>
                  <p className={`text-[10px] font-bold mt-1 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                    Belum terserap
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Card 4: PERSENTASE REALISASI */}
            <Card className={`relative overflow-hidden transition-all ${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <CardContent className={`m-3 ml-4 p-4 rounded-xl border flex flex-col justify-between min-h-[118px] ${isDark ? "bg-[#111827]/60 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div>
                  <p className={`text-[11px] font-extrabold tracking-wider uppercase ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                    PERSENTASE REALISASI
                  </p>
                  <div className="flex items-baseline justify-between mt-1">
                    <h2 className="text-2xl font-black tracking-tight text-[#dc2626] dark:text-[#ef4444]">
                      {kpi.persentase}%
                    </h2>
                    <span className={`text-[10px] font-bold ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                      Target: {kpi.target}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-red-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, kpi.persentase)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2: TREN REALISASI BULANAN & SERAPAN PER DIVISI */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Chart (2 columns span): Tren Realisasi Bulanan */}
            <Card className={`lg:col-span-2 ${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl flex flex-col justify-between`}>
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <CardTitle className={`text-base font-bold my-0 ${isDark ? "text-white" : "text-black"}`}>
                    Tren Realisasi Bulanan
                  </CardTitle>
                  <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                    Bar = Realisasi Keuangan • Garis Putus = Target Pagu / Bulan (Rp 3.81M)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-600/10 px-2.5 py-1 rounded-md border border-red-500/20">
                    {selectedTA}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-6 flex-1 flex flex-col justify-between">
                {/* Chart Graphic Area */}
                <div className={`h-52 w-full flex items-end justify-between gap-1.5 p-4 pt-7 border rounded-xl relative ${isDark ? "bg-[#111827]/60 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  {/* Dashed Target Line */}
                  <div className="absolute left-0 right-0 top-[38%] border-b-2 border-dashed border-red-500/60 z-10 flex items-center justify-end pr-2 pointer-events-none">
                    <span className="bg-black text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-gray-700">
                      Target (3.81M)
                    </span>
                  </div>

                  {MONTHLY_TREND_DATA.map((item, idx) => {
                    const maxScale = 6.0
                    const heightPct = (item.realisasi / maxScale) * 100

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group z-20">
                        <div className="w-full flex justify-center items-end h-full">
                          <div
                            style={{ height: `${item.isCompleted ? Math.max(6, heightPct) : 0}%` }}
                            className={`w-full max-w-[22px] rounded-t transition-all duration-300 relative ${
                              item.isCompleted
                                ? "bg-gradient-to-t from-red-700 to-red-500 group-hover:brightness-125"
                                : "bg-slate-200 dark:bg-slate-800"
                            }`}
                          >
                            {item.isCompleted && (
                              <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-0.5 px-1.5 rounded border border-gray-700 font-mono font-bold whitespace-nowrap z-30 pointer-events-none">
                                Rp {item.realisasi.toFixed(2)}M
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold ${isDark ? "text-gray-300" : "text-black"}`}>
                          {item.shortBulan}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Bottom Legend */}
                <div className="pt-4 flex items-center justify-center gap-6 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-600 rounded-xs"></span>
                    <span className={isDark ? "text-gray-300" : "text-slate-700"}>Realisasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 border-t-2 border-dashed border-red-500"></div>
                    <span className={isDark ? "text-gray-300" : "text-slate-700"}>Target Pagu/Bulan</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel (1 column span): Serapan per Divisi */}
            <Card className={`${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl flex flex-col justify-between`}>
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-red-600" />
                  <CardTitle className={`text-base font-bold my-0 ${isDark ? "text-white" : "text-black"}`}>
                    Serapan per Divisi
                  </CardTitle>
                </div>
                <span className="text-xs font-black text-white bg-red-600 px-2 py-0.5 rounded-md">
                  %
                </span>
              </CardHeader>

              <CardContent className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
                {SERAPAN_DIVISI_DATA.map((row) => (
                  <div
                    key={row.id}
                    onClick={() => setSelectedDivisi(selectedDivisi === row.nama ? "Semua Divisi" : row.nama)}
                    className={`p-3 rounded-xl border space-y-1.5 transition-all cursor-pointer ${
                      selectedDivisi === row.nama
                        ? isDark
                          ? "bg-red-950/30 border-red-500/50"
                          : "bg-red-50 border-red-300"
                        : isDark
                        ? "bg-[#111827]/60 border-white/10 hover:border-white/20"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
                        {row.nama}
                      </span>
                      <span className="font-mono font-black text-red-600 dark:text-red-400">
                        {row.pct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-600"
                        style={{ width: `${row.pct}%` }}
                      ></div>
                    </div>

                    {/* Subtext Realisasi / Pagu */}
                    <div className={`flex justify-between items-center text-[11px] font-mono font-bold ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                      <span>Rp {row.realisasi.toFixed(2)} M / Rp {row.pagu.toFixed(2)} M</span>
                      <span className="text-[10px] font-sans font-semibold text-slate-500">
                        {selectedDivisi === row.nama ? "Aktif" : "Filter"}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ========================================================================= */}
          {/* ROW 3: REALISASI TERBARU & TOP AKUN REALISASI (PTP KPU THEME) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2 cols span): Realisasi Terbaru */}
            <Card className={`lg:col-span-2 ${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl overflow-hidden flex flex-col justify-between`}>
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-red-600" />
                  <CardTitle className={`text-base font-bold my-0 ${isDark ? "text-white" : "text-black"}`}>
                    Realisasi Terbaru
                  </CardTitle>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate("realization-transactions")}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Semua</span>
                  <span>→</span>
                </button>
              </CardHeader>

              <CardContent className="p-0 flex-1">
                <Table>
                  <TableHeader>
                    <TableRow className={isDark ? "border-b border-white/20 bg-[#0a0e1a]" : "border-b border-slate-200 bg-slate-100"}>
                      <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-white" : "text-black"}`}>
                        NO. SK / DOKUMEN
                      </TableHead>
                      <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-white" : "text-black"}`}>
                        AKUN ANGGARAN
                      </TableHead>
                      <TableHead className={`text-[11px] font-extrabold uppercase ${isDark ? "text-white" : "text-black"}`}>
                        DIVISI
                      </TableHead>
                      <TableHead className={`text-[11px] font-extrabold uppercase text-right ${isDark ? "text-white" : "text-black"}`}>
                        JUMLAH REALISASI
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INITIAL_REALISASI_TERBARU.map((row) => (
                      <TableRow
                        key={row.id}
                        className={isDark ? "border-b border-white/10 hover:bg-white/[0.04]" : "border-b border-slate-100 hover:bg-slate-50"}
                      >
                        <TableCell className="text-xs">
                          <span className="font-mono font-bold text-red-600 dark:text-red-400 block">
                            {row.noDokumen}
                          </span>
                          <span className={`text-[11px] font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                            {row.tanggal}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className={`font-bold block ${isDark ? "text-white" : "text-black"}`}>
                            {row.namaAkun}
                          </span>
                          <span className={`text-[11px] font-mono font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                            {row.kodeAkun}
                          </span>
                        </TableCell>
                        <TableCell className={`text-xs font-bold ${isDark ? "text-gray-200" : "text-black"}`}>
                          {row.divisi}
                        </TableCell>
                        <TableCell className="text-xs font-black text-red-600 dark:text-red-500 text-right whitespace-nowrap font-mono">
                          {formatRupiah(row.jumlah)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Right Column (1 col span): Top Akun Realisasi */}
            <Card className={`${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl flex flex-col justify-between`}>
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  <CardTitle className={`text-base font-bold my-0 ${isDark ? "text-white" : "text-black"}`}>
                    Top Akun Realisasi
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3.5 flex-1 flex flex-col justify-between">
                {TOP_AKUN_DATA.map((item) => (
                  <div
                    key={item.rank}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border ${
                      isDark ? "bg-[#111827]/60 border-white/10" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {item.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold truncate ${isDark ? "text-white" : "text-black"}`}>
                          {item.nama}
                        </span>
                        <span className="font-mono font-black text-red-600 dark:text-red-400 shrink-0 ml-2">
                          {item.pct}%
                        </span>
                      </div>
                      <div className={`text-[11px] font-mono font-bold mt-0.5 ${isDark ? "text-gray-300" : "text-slate-800"}`}>
                        {item.amount}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-red-600 h-full rounded-full"
                          style={{ width: `${item.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TRANSAKSI SUBTAB */}
      {/* ========================================================================= */}
      {subTab === "transaksi" && (
        <div className="space-y-6">
          <Card className={`${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-red-600">
                  <Filter className="w-4 h-4" /> Filter Realisasi:
                </div>

                <div>
                  <select
                    value={filterSubbagian}
                    onChange={(e) => setFilterSubbagian(e.target.value)}
                    className={`rounded-xl px-3.5 py-2 border font-bold text-xs outline-none cursor-pointer ${
                      isDark ? "bg-[#131b2e] border-[#1e293b] text-white" : "bg-slate-50 border-slate-300 text-black"
                    }`}
                  >
                    <option value="Semua">Semua Divisi / Subbagian</option>
                    <option value="Keuangan">Keuangan & Umum</option>
                    <option value="Teknis">Teknis Penyelenggaraan</option>
                    <option value="Sosialisasi">Sosialisasi & SDM</option>
                    <option value="Perencanaan">Perencanaan & Data</option>
                    <option value="Hukum">Hukum & Pengawasan</option>
                  </select>
                </div>

                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-slate-600"}`} />
                  <input
                    type="text"
                    placeholder="Cari Dokumen, Akun, Usulan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-9 pr-3.5 py-2 text-xs font-semibold rounded-xl border outline-none ${
                      isDark ? "bg-[#131b2e] border-[#1e293b] text-white placeholder-gray-500" : "bg-slate-50 border-slate-300 text-black placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-kpu-red px-3.5 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Transaksi</span>
              </button>
            </CardContent>
          </Card>

          <Card className={`${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl overflow-hidden`}>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className={isDark ? "border-b border-white/20 bg-[#0a0e1a]" : "border-b border-slate-200 bg-slate-100"}>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>No. Dokumen</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>Tanggal</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>Akun Anggaran</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>Divisi / Subbagian</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>Usulan Kegiatan</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-right ${isDark ? "text-white" : "text-black"}`}>Jumlah (Rp)</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-center ${isDark ? "text-white" : "text-black"}`}>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((item) => (
                    <TableRow key={item.id} className={isDark ? "border-b border-white/10 hover:bg-white/[0.04]" : "border-b border-slate-100 hover:bg-slate-50"}>
                      <TableCell className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{item.noDokumen}</TableCell>
                      <TableCell className={`text-xs font-semibold whitespace-nowrap ${isDark ? "text-gray-300" : "text-black"}`}>{item.tanggal}</TableCell>
                      <TableCell className="text-xs">
                        <span className={`font-mono font-bold block ${isDark ? "text-white" : "text-black"}`}>{item.kodeAkun}</span>
                        <span className={`text-[11px] font-semibold ${isDark ? "text-gray-300" : "text-slate-800"}`}>{item.namaAkun}</span>
                      </TableCell>
                      <TableCell className={`text-xs font-bold ${isDark ? "text-gray-200" : "text-black"}`}>{item.subbagian}</TableCell>
                      <TableCell className={`font-bold text-xs truncate max-w-xs ${isDark ? "text-white" : "text-black"}`}>{item.usulanKegiatan}</TableCell>
                      <TableCell className="text-xs font-black text-red-600 dark:text-red-500 text-right whitespace-nowrap font-mono">{formatRupiah(item.jumlah)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.status === "Disetujui" ? "terkirim" : "diproses"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LAPORAN SUBTAB */}
      {/* ========================================================================= */}
      {subTab === "laporan" && (
        <div className="space-y-6">
          <Card className={`${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
            <CardHeader className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <CardTitle className={`text-base font-bold my-0 ${isDark ? "text-white" : "text-black"}`}>
                  Laporan Rekapitulasi Realisasi Anggaran {selectedTA}
                </CardTitle>
                <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                  Laporan resmi penyerapan anggaran per divisi dan mata anggaran TA 2025
                </p>
              </div>
              <button
                onClick={() => setIsLaporanOpen(true)}
                className="btn-kpu-red px-4 py-2 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Laporan (.csv)</span>
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className={isDark ? "border-b border-white/20 bg-[#0a0e1a]" : "border-b border-slate-200 bg-slate-100"}>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>KODE AKUN</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>NAMA AKUN</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>DIVISI</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-right ${isDark ? "text-white" : "text-black"}`}>PAGU (RP)</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-right ${isDark ? "text-white" : "text-black"}`}>REALISASI (RP)</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-right ${isDark ? "text-white" : "text-black"}`}>SISA (RP)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {akunList.map((a) => (
                    <TableRow key={a.kode} className={isDark ? "border-b border-white/10 hover:bg-white/[0.04]" : "border-b border-slate-100 hover:bg-slate-50"}>
                      <TableCell className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{a.kode}</TableCell>
                      <TableCell className={`text-xs font-bold ${isDark ? "text-white" : "text-black"}`}>{a.nama}</TableCell>
                      <TableCell className={`text-xs font-bold ${isDark ? "text-gray-300" : "text-slate-800"}`}>{a.divisi || "Semua Divisi"}</TableCell>
                      <TableCell className={`text-xs font-bold text-right font-mono ${isDark ? "text-gray-200" : "text-black"}`}>{formatRupiah(a.pagu)}</TableCell>
                      <TableCell className="text-xs font-black text-red-600 dark:text-red-500 text-right font-mono">{formatRupiah(a.realisasi)}</TableCell>
                      <TableCell className={`text-xs font-bold text-right font-mono ${isDark ? "text-gray-300" : "text-slate-800"}`}>{formatRupiah(a.sisa)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VERIFIKASI SUBTAB */}
      {/* ========================================================================= */}
      {subTab === "verifikasi" && (
        <div className="space-y-6">
          <Card className={`${isDark ? "bg-[#1e293b]/70 border-white/10" : "bg-white/85 border-slate-200"} backdrop-blur-md shadow-lg rounded-2xl`}>
            <CardHeader className="p-5 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <CardTitle className={`text-base font-bold my-0 ${isDark ? "text-white" : "text-black"}`}>
                  Verifikasi Dokumen Realisasi Keuangan
                </CardTitle>
                <p className={`text-xs mt-1 font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                  Pemeriksaan kelengkapan dokumen pertanggungjawaban SPJ & SPM
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className={isDark ? "border-b border-white/20 bg-[#0a0e1a]" : "border-b border-slate-200 bg-slate-100"}>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>NO. DOKUMEN</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>USULAN & DIVISI</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-right ${isDark ? "text-white" : "text-black"}`}>JUMLAH REALISASI</TableHead>
                    <TableHead className={`text-[11px] font-extrabold ${isDark ? "text-white" : "text-black"}`}>BUKTI FISIK</TableHead>
                    <TableHead className={`text-[11px] font-extrabold text-center ${isDark ? "text-white" : "text-black"}`}>STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaksiList.map((t) => (
                    <TableRow key={t.id} className={isDark ? "border-b border-white/10 hover:bg-white/[0.04]" : "border-b border-slate-100 hover:bg-slate-50"}>
                      <TableCell className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{t.noDokumen}</TableCell>
                      <TableCell className="text-xs">
                        <p className={`font-bold ${isDark ? "text-white" : "text-black"}`}>{t.usulanKegiatan}</p>
                        <p className={`text-[11px] font-semibold ${isDark ? "text-gray-300" : "text-slate-700"}`}>{t.subbagian}</p>
                      </TableCell>
                      <TableCell className="text-xs font-black text-red-600 dark:text-red-500 text-right font-mono">{formatRupiah(t.jumlah)}</TableCell>
                      <TableCell className={`text-xs font-mono font-bold flex items-center gap-1.5 ${isDark ? "text-white" : "text-black"}`}>
                        <FileText className="w-3.5 h-3.5 text-red-600" /> {t.buktiFile}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={t.status === "Disetujui" ? "terkirim" : "warning"}>{t.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      <TambahRealisasiModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        akunList={akunList}
        onSave={handleSaveRealisasi}
        theme={theme}
      />

      <LaporanBulananModal
        isOpen={isLaporanOpen}
        onClose={() => setIsLaporanOpen(false)}
        transaksiList={transaksiList}
        theme={theme}
      />
    </div>
  )
}
