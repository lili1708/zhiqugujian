import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { DashboardOutlined, EnvironmentOutlined, UserOutlined, FileTextOutlined, BarChartOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons'

const { Sider, Content } = Layout

export default function AdminLayout() {
  const items = [
    { key: '/', label: '仪表盘', icon: <DashboardOutlined /> },
    { key: 'buildings', label: '古建管理', icon: <EnvironmentOutlined /> },
    { key: 'users', label: '用户管理', icon: <UserOutlined /> },
    { key: 'checkins', label: '打卡管理', icon: <EnvironmentOutlined /> },
    { key: 'posts', label: '内容审核', icon: <FileTextOutlined /> },
    { key: 'courses', label: '课程管理', icon: <BookOutlined /> },
    { key: 'stats', label: '数据统计', icon: <BarChartOutlined /> },
    { key: 'settings', label: '系统设置', icon: <SettingOutlined /> },
  ]
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={false}>
        <div style={{ color: '#fff', padding: 16, textAlign: 'center', fontWeight: 600 }}>古迹管家</div>
        <Menu theme="dark" mode="inline" items={items.map(it => ({ key: it.key, icon: it.icon, label: <Link to={it.key}>{it.label}</Link> }))} />
      </Sider>
      <Layout>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
