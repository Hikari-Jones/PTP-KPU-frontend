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
  theme?: "light" | "dark"
}

export function Sidebar({ collapsed, onToggleCollapse, activeMenu, onSelectMenu, onLogout, theme = "light" }: SidebarProps) {
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

  const isDark = theme === "dark"

  return (
    <aside
      className={`relative flex flex-col justify-between h-screen transition-all duration-300 z-20 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      } ${
        isDark 
          ? "bg-[#070b14] border-r border-[#1e293b]/60 text-gray-200" 
          : "bg-white border-r border-slate-200 text-slate-700 shadow-sm"
      }`}
    >
      {/* Header / Logo */}
      <div>
        <div className={`flex items-center h-16 ${
          collapsed ? "justify-center p-4" : "justify-between p-4"
        } ${isDark ? "border-b border-[#1e293b]/40" : "border-b border-slate-200"}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-base shrink-0 shadow-md shadow-red-600/30">
                PTP
              </div>
              <div className="flex flex-col truncate">
                <span className={`font-bold text-sm leading-tight truncate ${isDark ? "text-gray-100" : "text-slate-900"}`}>
                  PTP-KPU
                </span>
                <span className={`text-[10px] font-medium truncate ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Platform Terpadu
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark 
                ? "hover:bg-[#1e293b] text-gray-400 hover:text-white" 
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="p-3 space-y-6">
          <div>
            {!collapsed && (
              <div className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-gray-500" : "text-slate-400"
              }`}>
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
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : isDark
                          ? "text-gray-400 hover:text-gray-100 hover:bg-[#131b2e]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
              <div className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-gray-500" : "text-slate-400"
              }`}>
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
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : isDark
                          ? "text-gray-400 hover:text-gray-100 hover:bg-[#131b2e]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
      <div className={`p-3 border-t ${isDark ? "border-[#1e293b]/40" : "border-slate-200"}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl border ${
          collapsed ? "justify-center" : ""
        } ${
          isDark 
            ? "bg-[#0d1424] border-[#1e293b]/60" 
            : "bg-slate-50 border-slate-200"
        }`}>
          <Avatar className="w-8 h-8 shrink-0 border border-red-500/40">
            <AvatarImage src="" alt="Ahmad Kurniawan" />
            <AvatarFallback className="bg-red-600 text-white font-bold text-xs">AK</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className={`text-xs font-semibold truncate ${isDark ? "text-gray-100" : "text-slate-800"}`}>Ahmad Kurniawan</p>
              <p className={`text-[10px] truncate ${isDark ? "text-gray-400" : "text-slate-500"}`}>Staff Bidang Teknis</p>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className={`w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isDark 
              ? "text-gray-400 hover:text-red-400 hover:bg-red-950/20" 
              : "text-slate-600 hover:text-red-600 hover:bg-red-50"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title="Keluar"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  )
}
