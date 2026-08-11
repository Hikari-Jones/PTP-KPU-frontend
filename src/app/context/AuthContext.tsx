import React, { createContext, useContext, useState, useEffect } from "react"

export interface UserProfile {
  name: string
  email: string
  role: "Admin" | "Operator" | "User"
  jabatan: string
  divisi: string
}

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string
  currentUser: UserProfile | null
  login: (email: string, pass: string) => { success: boolean; error?: string }
  logout: () => void
}

const DEFAULT_USERS: UserProfile[] = [
  {
    name: "Admin KPU Sulut",
    email: "admin@kpu.go.id",
    role: "Admin",
    jabatan: "Administrator Sistem",
    divisi: "Bagian Perencanaan & Data",
  },
  {
    name: "Ahmad Kurniawan",
    email: "ahmad.kurniawan@kpu.go.id",
    role: "Operator",
    jabatan: "Staf Bidang Teknis Penyelenggaraan",
    divisi: "Teknis Penyelenggaraan",
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("ptp_kpu_user")
    return saved ? JSON.parse(saved) : null
  })

  const isAuthenticated = !!currentUser
  const userRole = currentUser?.role || ""

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ptp_kpu_user", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("ptp_kpu_user")
    }
  }, [currentUser])

  const login = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase()
    
    // Check known demo users first
    const matchedUser = DEFAULT_USERS.find((u) => u.email.toLowerCase() === trimmedEmail)
    
    if (matchedUser) {
      // Validate password for known users
      if ((matchedUser.role === "Admin" && pass === "admin123") ||
          (matchedUser.role === "Operator" && (pass === "123456" || pass === "••••••••" || pass.length >= 4))) {
        setCurrentUser(matchedUser)
        return { success: true }
      } else {
        return { success: false, error: "Email/Kata Sandi Tidak Valid" }
      }
    }

    // Generic check for any valid @kpu.go.id or valid email format if password length >= 6
    if (trimmedEmail.includes("@") && pass.length >= 6) {
      const newUser: UserProfile = {
        name: trimmedEmail.split("@")[0].toUpperCase(),
        email: trimmedEmail,
        role: trimmedEmail.includes("admin") ? "Admin" : "Operator",
        jabatan: "Staf Penyelenggara KPU",
        divisi: "Sekretariat KPU Sulut",
      }
      setCurrentUser(newUser)
      return { success: true }
    }

    return { success: false, error: "Email/Kata Sandi Tidak Valid" }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("ptp_kpu_user")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
