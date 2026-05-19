import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AuthProvider } from './contexts/AuthContext'
import BottomNav from './components/BottomNav'
import AppShell from './components/AppShell'
// Admin portal is a separate app; no in-app admin entry
import { Skeleton, ListSkeleton } from './components/Skeleton'
import { ErrorBoundary } from './components/ErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const Learn = lazy(() => import('./pages/Learn'))
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Profile = lazy(() => import('./pages/Profile'))
const Auth = lazy(() => import('./pages/Auth'))
const Notifications = lazy(() => import('./pages/Notifications'))

// Admin pages (removed from APP; backend admin will be separate)

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="p-4">
        <ListSkeleton count={3} />
      </div>
    </div>
  )
}

// MobileApp wrapper removed in favor of AppShell-based layout

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* App routes wrapped by AppShell for consistent layout */}
              <Route path="/" element={<AppShell><Home /></AppShell>} />
              <Route path="/learn" element={<AppShell><Learn /></AppShell>} />
              <Route path="/checkin" element={<AppShell><CheckIn /></AppShell>} />
              <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/notifications" element={<AppShell><Notifications /></AppShell>} />
              
              // Admin routes handled by separate admin-app
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
