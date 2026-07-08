// Zustand store: sidebar open, view mode, dark mode
import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  toggleDarkMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  darkMode: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDarkMode: () => set((s) => {
    const next = !s.darkMode
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
    }
    return { darkMode: next }
  }),
}))
