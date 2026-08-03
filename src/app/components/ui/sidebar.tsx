import { 
  LayoutDashboard, 
  Wallet, 
  Mail, 
  Archive, 
  Trash2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

export interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  activeMenu: string
  onSelectMenu: (id: string) => void
  onLogout?: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, activeMenu, onSelectMenu, onLogout }: SidebarProps) {
  const mainMenu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "anggaran", label: "Anggaran", icon: Wallet },
    { id: "surat", label: "Surat Menyurat", icon: Mail },
    { id: "arsip", label: "Arsip Data", icon: Archive },
    { id: "sampah", label: "Sampah", icon: Trash2 },
  ]

  const umunMenu = [
    { id: "pengaturan", label: "Pengaturan", icon: Settings },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ]

  return (
    <aside
      className={`relative flex flex-col justify-between h-screen bg-[#070b14] border-r border-[#1e293b]/60 transition-all duration-300 z-20 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header / Logo */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]/40 h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-md shadow-red-900/30">
              KPU
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm text-gray-100 leading-tight truncate">
                  KPU Sulawesi
                </span>
                <span className="text-xs text-gray-400 font-normal truncate">Utara</span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-[#1e293b] text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="p-3 space-y-6">
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Menu Utama
              </div>
            )}
            <nav className="space-y-1">
              {mainMenu.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectMenu(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                        : "text-gray-400 hover:text-gray-100 hover:bg-[#131b2e]"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )
              })}
            </nav>
          </div>

          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Umum
              </div>
            )}
            <nav className="space-y-1">
              {umunMenu.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectMenu(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                        : "text-gray-400 hover:text-gray-100 hover:bg-[#131b2e]"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Profile Footer */}
      <div className="p-3 border-t border-[#1e293b]/40">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-[#0d1424] border border-[#1e293b]/60 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="w-8 h-8 shrink-0 border border-red-900/40">
            <AvatarImage src="" alt="Ahmad Kurniawan" />
            <AvatarFallback className="bg-red-950 text-red-300 font-bold text-xs">AK</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-gray-100 truncate">Ahmad Kurniawan</p>
              <p className="text-[10px] text-gray-400 truncate">Staff Bidang Teknis</p>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className={`w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title="Keluar"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  )
}
