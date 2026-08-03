import { useState } from "react"
import {
  Search,
  Bell,
  User as UserIcon,
  Mail,
  Archive,
  Wallet,
  Settings,
  Trash2,
  TrendingUp,
  LogOut,
  Sun,
  Moon,
  Shield
} from "lucide-react"

import { Sidebar } from "./app/components/ui/sidebar"
import { Card, CardContent } from "./app/components/ui/card"
import { Badge } from "./app/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./app/components/ui/table"
import { DashboardChart } from "./app/components/ui/chart"
import { ChatbotWidget } from "./app/components/ui/chatbot"
import { LoginPage } from "./app/components/ui/login-page"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("ptp_kpu_is_logged_in") === "true"
  })

  // Theme state: default is "light" (White & Red)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("ptp_kpu_theme") as "light" | "dark") || "light"
  })

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState("dashboard")

  const handleLogin = () => {
    localStorage.setItem("ptp_kpu_is_logged_in", "true")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("ptp_kpu_is_logged_in")
    setIsLoggedIn(false)
  }

  const toggleTheme = (newTheme?: "light" | "dark") => {
    const next = newTheme || (theme === "light" ? "dark" : "light")
    setTheme(next)
    localStorage.setItem("ptp_kpu_theme", next)
  }

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLogin} theme={theme} onToggleTheme={() => toggleTheme()} />
  }

  const isDark = theme === "dark"

  const recentSurat = [
    {
      no: "001/KPU-SU/VI/2026",
      perihal: "Undangan Rapat Pleno Rekapitulasi DPT",
      dari: "Ketua KPU Provinsi",
      tanggal: "20 Jun 2026",
      status: "terkirim",
      statusLabel: "terkirim",
    },
    {
      no: "002/KPU-SU/VI/2026",
      perihal: "Laporan Rekap DPT Kab. Minahasa 2026",
      dari: "KPU Kab. Minahasa",
      tanggal: "19 Jun 2026",
      status: "diterima",
      statusLabel: "diterima",
    },
    {
      no: "003/KPU-SU/VI/2026",
      perihal: "Permohonan Klarifikasi Data Pemilih",
      dari: "Bawaslu Sulut",
      tanggal: "18 Jun 2026",
      status: "diproses",
      statusLabel: "diproses",
    },
    {
      no: "004/KPU-SU/VI/2026",
      perihal: "Nota Dinas Pengadaan Logistik Pilkada",
      dari: "Subbagian Logistik",
      tanggal: "17 Jun 2026",
      status: "draft",
      statusLabel: "draft",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      icon: Mail,
      text: "Surat Undangan Pleno KPU No. 042 diterima",
      time: "09:24",
      iconColor: "text-red-600 bg-red-500/10 border border-red-500/20",
    },
    {
      id: 2,
      icon: Archive,
      text: "Dokumen Arsip Pilkada 2026 telah diverifikasi",
      time: "08:50",
      iconColor: "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20",
    },
    {
      id: 3,
      icon: Wallet,
      text: "Laporan Pengeluaran Operasional disetujui",
      time: "08:15",
      iconColor: "text-amber-600 bg-amber-500/10 border border-amber-500/20",
    },
    {
      id: 4,
      icon: Settings,
      text: "Konfigurasi keamanan sistem diperbarui",
      time: "Kemarin",
      iconColor: "text-purple-600 bg-purple-500/10 border border-purple-500/20",
    },
    {
      id: 5,
      icon: Trash2,
      text: "5 draf dokumen kadaluarsa dibersihkan",
      time: "2 hari lalu",
      iconColor: "text-slate-500 bg-slate-500/10 border border-slate-500/20",
    },
  ]

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#080c14] text-gray-100" : "bg-slate-100 text-slate-900"
      }`}>
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeMenu={activeMenu}
        onSelectMenu={(id: string) => setActiveMenu(id)}
        onLogout={handleLogout}
        theme={theme}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className={`h-16 border-b px-6 flex items-center justify-between backdrop-blur-sm shrink-0 transition-colors duration-300 ${isDark
            ? "bg-[#080c14]/80 border-[#1e293b]/60 text-gray-100"
            : "bg-white/90 border-slate-200 text-slate-800 shadow-xs"
          }`}>
          {/* Search Bar on far left */}
          <div className="relative w-48 md:w-64">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Cari dokumen, surat..."
              className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-red-500 ${isDark
                  ? "bg-[#111827] border border-[#1e293b] text-gray-200 placeholder-gray-500"
                  : "bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
                }`}
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Quick Toggle */}
            <button
              onClick={() => toggleTheme()}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${isDark
                  ? "bg-[#111827] border-[#1e293b] text-amber-400 hover:text-amber-300 hover:bg-[#1a233a]"
                  : "bg-slate-50 border-slate-300 text-slate-700 hover:text-red-600 hover:bg-slate-100"
                }`}
              title={`Ganti ke ${isDark ? "Mode Terang (Putih & Merah)" : "Mode Gelap (Biru Tua)"}`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Icon */}
            <button className={`relative p-2 rounded-lg border transition-colors ${isDark
                ? "border-[#1e293b] bg-[#111827] text-gray-400 hover:text-white"
                : "border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${isDark
                ? "border-red-500/30 bg-red-950/20 text-gray-200"
                : "border-red-200 bg-red-50 text-red-900"
              }`}>
              <UserIcon className="w-3.5 h-3.5 text-red-600" />
              <span className="font-semibold">Ahmad</span>
            </div>

            {/* Logout Button in Header */}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${isDark
                  ? "border-[#1e293b] bg-[#111827] text-gray-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/30"
                  : "border-slate-300 bg-slate-50 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                }`}
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* MENU: PENGATURAN / SETTINGS */}
            {activeMenu === "pengaturan" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h1 className={`text-2xl font-bold tracking-tight my-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Pengaturan Aplikasi
                  </h1>
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    Kelola opsi akun dan informasi staf PTP-KPU
                  </p>
                </div>

                {/* Account Profile Card */}
                <Card className={isDark ? "bg-[#0c1322] border-[#1e293b]" : "bg-white border-slate-200 shadow-sm"}>
                  <div className={`p-5 border-b flex items-center gap-3 ${isDark ? "border-[#1e293b]" : "border-slate-200"}`}>
                    <div className="p-2 rounded-lg bg-blue-600 text-white">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        Informasi Pengguna
                      </h3>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                        Detail akun operator PTP-KPU
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-slate-700"}`}>Nama Lengkap</label>
                        <input
                          type="text"
                          readOnly
                          value="Ahmad Kurniawan"
                          className={`w-full rounded-lg px-3 py-2 border ${isDark ? "bg-[#111827] border-[#1e293b] text-gray-200" : "bg-slate-100 border-slate-300 text-slate-800"
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-slate-700"}`}>Email Instansi</label>
                        <input
                          type="email"
                          readOnly
                          value="ahmad.kurniawan@kpu.go.id"
                          className={`w-full rounded-lg px-3 py-2 border ${isDark ? "bg-[#111827] border-[#1e293b] text-gray-200" : "bg-slate-100 border-slate-300 text-slate-800"
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-slate-700"}`}>Jabatan / Divisi</label>
                        <input
                          type="text"
                          readOnly
                          value="Staff Bidang Teknis Penyelenggaraan"
                          className={`w-full rounded-lg px-3 py-2 border ${isDark ? "bg-[#111827] border-[#1e293b] text-gray-200" : "bg-slate-100 border-slate-300 text-slate-800"
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`font-semibold block mb-1 ${isDark ? "text-gray-300" : "text-slate-700"}`}>Akses Keamanan</label>
                        <div className="flex items-center gap-2 pt-1 text-emerald-600 font-semibold">
                          <Shield className="w-4 h-4" />
                          <span>Terverifikasi (Admin Operasional)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* OTHER MENUS (Anggaran, Surat, Arsip, Sampah, FAQ) */}
            {activeMenu !== "dashboard" && activeMenu !== "pengaturan" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h1 className={`text-2xl font-bold tracking-tight my-0 capitalize ${isDark ? "text-white" : "text-slate-900"}`}>
                    {activeMenu}
                  </h1>
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    Halaman modul {activeMenu} PTP-KPU
                  </p>
                </div>
                <Card className={`p-8 text-center ${isDark ? "bg-[#0d1322]/80 border-[#1e293b]" : "bg-white border-slate-200 shadow-sm"}`}>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                    Modul <strong className="capitalize text-red-600">{activeMenu}</strong> siap digunakan dalam sistem PTP-KPU.
                  </p>
                  <button
                    onClick={() => setActiveMenu("dashboard")}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Kembali ke Dashboard
                  </button>
                </Card>
              </div>
            )}

            {/* DEFAULT VIEW: DASHBOARD */}
            {activeMenu === "dashboard" && (
              <>
                {/* Page Header */}
                <div>
                  <h1 className={`text-2xl font-bold tracking-tight my-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Dashboard Operasional
                  </h1>
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    Ringkasan data operasional Platform Terpadu Penunjang KPU (PTP-KPU)
                  </p>
                </div>

                {/* Top Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Surat Masuk Card */}
                  <Card className={isDark ? "bg-gradient-to-br from-[#0e1628] to-[#0a101d] border-[#1e293b]" : "bg-white border-slate-200 shadow-sm"}>
                    <CardContent className="p-6 pt-6 flex items-start justify-between">
                      <div>
                        <div className="mt-3 mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 inline-block shadow-xs">
                          <Mail className="w-5 h-5" />
                        </div>
                        <p className={`text-[11px] font-bold tracking-wider uppercase ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          Surat Masuk Aktif
                        </p>
                        <h2 className={`text-3xl font-extrabold mt-1 mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>12</h2>
                        <p className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                          <span>3 memerlukan respons</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arsip Dokumen Card */}
                  <Card className={isDark ? "bg-gradient-to-br from-[#0e1628] to-[#0a101d] border-[#1e293b]" : "bg-white border-slate-200 shadow-sm"}>
                    <CardContent className="p-6 pt-6 flex items-start justify-between">
                      <div>
                        <div className="mt-3 mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 inline-block shadow-xs">
                          <Archive className="w-5 h-5" />
                        </div>
                        <p className={`text-[11px] font-bold tracking-wider uppercase ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          Arsip Dokumen
                        </p>
                        <h2 className={`text-3xl font-extrabold mt-1 mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>248</h2>
                        <p className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span>6 diunggah bulan ini</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Chart Section */}
                <DashboardChart theme={theme} />

                {/* Bottom Grid: Surat Menyurat & Aktivitas Terkini */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Table Column (2 cols wide) */}
                  <div className="lg:col-span-2">
                    <Card className={`h-full ${isDark ? "bg-[#0d1322]/80 border-[#1e293b]" : "bg-white border-slate-200 shadow-sm"}`}>
                      <div className={`p-4 border-b flex items-center justify-between ${isDark ? "border-[#1e293b]" : "border-slate-200"}`}>
                        <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Surat Menyurat Terbaru</h3>
                      </div>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className={isDark ? "border-b border-[#1e293b]/60 hover:bg-transparent" : "border-b border-slate-200 bg-slate-50"}>
                              <TableHead className={`text-[11px] uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-600"}`}>No. Surat</TableHead>
                              <TableHead className={`text-[11px] uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-600"}`}>Perihal</TableHead>
                              <TableHead className={`text-[11px] uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-600"}`}>Dari</TableHead>
                              <TableHead className={`text-[11px] uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-600"}`}>Tanggal</TableHead>
                              <TableHead className={`text-[11px] uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-600"}`}>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentSurat.map((row, idx) => (
                              <TableRow key={idx} className={isDark ? "hover:bg-[#1e293b]/40 border-b border-[#1e293b]/40" : "hover:bg-slate-50 border-b border-slate-100"}>
                                <TableCell className={`font-mono text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>{row.no}</TableCell>
                                <TableCell className={`font-medium text-xs ${isDark ? "text-gray-200" : "text-slate-800"}`}>{row.perihal}</TableCell>
                                <TableCell className={`text-xs ${isDark ? "text-gray-400" : "text-slate-600"}`}>{row.dari}</TableCell>
                                <TableCell className={`text-xs whitespace-nowrap ${isDark ? "text-gray-400" : "text-slate-500"}`}>{row.tanggal}</TableCell>
                                <TableCell>
                                  <Badge variant={row.status as any}>{row.statusLabel}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Aktivitas Terkini Column (1 col wide) */}
                  <div>
                    <Card className={`h-full ${isDark ? "bg-[#0d1322]/80 border-[#1e293b]" : "bg-white border-slate-200 shadow-sm"}`}>
                      <div className={`p-4 border-b flex items-center justify-between ${isDark ? "border-[#1e293b]" : "border-slate-200"}`}>
                        <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Aktivitas Terkini</h3>
                      </div>
                      <CardContent className="p-4 space-y-3.5">
                        {recentActivities.map((act) => {
                          const Icon = act.icon
                          return (
                            <div key={act.id} className="flex items-center gap-3 text-xs">
                              <div className={`p-2.5 rounded-xl shrink-0 ${act.iconColor}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium leading-snug truncate ${isDark ? "text-gray-200" : "text-slate-800"}`}>{act.text}</p>
                                <span className={`text-[10px] mt-0.5 block ${isDark ? "text-gray-400" : "text-slate-500"}`}>{act.time}</span>
                              </div>
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Floating Chatbot Widget */}
      <ChatbotWidget theme={theme} />
    </div>
  )
}
