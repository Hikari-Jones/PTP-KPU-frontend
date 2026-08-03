import { useState } from "react"
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  Mail, 
  FolderArchive, 
  TrendingUp, 
  FileText, 
  Database, 
  CheckCircle2 
} from "lucide-react"

import { Sidebar } from "./app/components/ui/sidebar"
import { Breadcrumb } from "./app/components/ui/breadcrumb"
import { Card, CardContent } from "./app/components/ui/card"
import { Badge } from "./app/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./app/components/ui/table"
import { DashboardChart } from "./app/components/ui/chart"
import { ChatbotWidget } from "./app/components/ui/chatbot"

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState("dashboard")

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
      dari: "Divisi Logistik",
      tanggal: "17 Jun 2026",
      status: "draft",
      statusLabel: "draft",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      icon: Mail,
      text: "Surat dari Bawaslu Sulut diterima",
      time: "09:24",
      iconColor: "text-blue-400",
    },
    {
      id: 2,
      icon: Database,
      text: "DPT Kab. Sangihe diperbarui",
      time: "08:50",
      iconColor: "text-emerald-400",
    },
    {
      id: 3,
      icon: FileText,
      text: "Realisasi anggaran Juni diinput",
      time: "08:15",
      iconColor: "text-amber-400",
    },
    {
      id: 4,
      icon: UserIcon,
      text: "Akun baru ditambahkan Admin",
      time: "Kemarin",
      iconColor: "text-purple-400",
    },
    {
      id: 5,
      icon: CheckCircle2,
      text: "Backup arsip otomatis selesai",
      time: "00:00",
      iconColor: "text-gray-400",
    },
  ]

  return (
    <div className="flex h-screen bg-[#080c14] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeMenu={activeMenu}
        onSelectMenu={(id: string) => setActiveMenu(id)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-[#1e293b]/60 px-6 flex items-center justify-between bg-[#080c14]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <Breadcrumb
              items={[
                { label: "Dashboard", active: activeMenu === "dashboard" },
                ...(activeMenu !== "dashboard" ? [{ label: activeMenu, active: true }] : []),
              ]}
            />
            <span className="hidden md:inline text-xs text-gray-400 pl-4 border-l border-gray-800">
              Senin, 3 Agustus 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-48 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari dokumen, surat..."
                className="w-full bg-[#111827] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Notification Icon */}
            <button className="relative p-2 rounded-lg border border-[#1e293b] bg-[#111827] text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 text-xs text-gray-200">
              <UserIcon className="w-3.5 h-3.5 text-red-400" />
              <span className="font-medium">Ahmad</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight my-0">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-1">
                Ringkasan data operasional KPU Sulawesi Utara — 21 Juni 2026
              </p>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Surat Masuk Card */}
              <Card className="bg-gradient-to-br from-[#0e1628] to-[#0a101d] border-[#1e293b]">
                <CardContent className="p-5 flex items-start justify-between">
                  <div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 inline-block mb-3">
                      <Mail className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-gray-400">
                      Surat Masuk Aktif
                    </p>
                    <h2 className="text-3xl font-extrabold text-white mt-1 mb-1">12</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>3 memerlukan respons</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Arsip Dokumen Card */}
              <Card className="bg-gradient-to-br from-[#0e1628] to-[#0a101d] border-[#1e293b]">
                <CardContent className="p-5 flex items-start justify-between">
                  <div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 inline-block mb-3">
                      <FolderArchive className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-gray-400">
                      Arsip Dokumen
                    </p>
                    <h2 className="text-3xl font-extrabold text-white mt-1 mb-1">248</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>6 diunggah bulan ini</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visual Chart Section */}
            <DashboardChart />

            {/* Bottom Grid: Surat Menyurat & Aktivitas Terkini */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Table Column (2 cols wide) */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Surat Menyurat Terbaru</h3>
                  </div>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-[#1e293b]/60 hover:bg-transparent">
                          <TableHead className="text-[11px] uppercase tracking-wider text-gray-400">No. Surat</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider text-gray-400">Perihal</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider text-gray-400">Dari</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider text-gray-400">Tanggal</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider text-gray-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSurat.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs text-gray-400">{row.no}</TableCell>
                            <TableCell className="font-medium text-xs text-gray-200">{row.perihal}</TableCell>
                            <TableCell className="text-xs text-gray-400">{row.dari}</TableCell>
                            <TableCell className="text-xs text-gray-400 whitespace-nowrap">{row.tanggal}</TableCell>
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
                <Card className="h-full">
                  <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Aktivitas Terkini</h3>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    {recentActivities.map((act) => {
                      const Icon = act.icon
                      return (
                        <div key={act.id} className="flex items-start gap-3 text-xs">
                          <div className={`mt-0.5 shrink-0 ${act.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-200 font-medium leading-snug">{act.text}</p>
                            <span className="text-[10px] text-gray-400 mt-0.5 block">{act.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
