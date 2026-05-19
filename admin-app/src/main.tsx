import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminBuildings from './pages/AdminBuildings'
import AdminUsers from './pages/AdminUsers'
import AdminCheckIns from './pages/AdminCheckIns'
import AdminPosts from './pages/AdminPosts'
import AdminCourses from './pages/AdminCourses'
import AdminSettings from './pages/AdminSettings'
import AdminStats from './pages/AdminStats'
import 'antd/dist/reset.css'

const router = createBrowserRouter([
  { path: '/', element: <AdminLayout />, children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'buildings', element: <AdminBuildings /> },
    { path: 'users', element: <AdminUsers /> },
    { path: 'checkins', element: <AdminCheckIns /> },
    { path: 'posts', element: <AdminPosts /> },
    { path: 'courses', element: <AdminCourses /> },
    { path: 'stats', element: <AdminStats /> },
    { path: 'settings', element: <AdminSettings /> },
  ]}
])

const root = createRoot(document.getElementById('root')!)
root.render(<RouterProvider router={router} />)
