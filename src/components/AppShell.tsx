import React from 'react'
import BottomNav from './BottomNav'

// Simple shell layout to wrap pages with a consistent header and bottom nav
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header style={{ display: 'none' }} aria-label="site-header" />
      <main style={{ flex: 1 }}>{children}</main>
      <BottomNav />
    </div>
  )
}
