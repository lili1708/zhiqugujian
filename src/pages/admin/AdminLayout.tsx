import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  ShopOutlined, 
  UserOutlined, 
  EnvironmentOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/admin/buildings', icon: <EnvironmentOutlined />, label: '古建管理' },
  { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/admin/checkins', icon: <ShopOutlined />, label: '打卡管理' },
  { key: '/admin/posts', icon: <FileTextOutlined />, label: '内容审核' },
  { key: '/admin/stats', icon: <BarChartOutlined />, label: '数据统计' },
  { key: '/admin/settings', icon: <SettingOutlined />, label: '系统设置' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    const item = menuItems.find(item => path.startsWith(item.key) && item.key !== '/admin');
    return item ? item.key : '/admin';
  };

  return (
    <Layout className="admin-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="admin-sider"
      >
        <div className="admin-logo">
          {collapsed ? '智取' : '智取古建'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>
          }))}
        />
      </Sider>
      <Layout>
        <Header className="admin-header">
          <span className="trigger" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          <div className="admin-user">
            <span>管理员</span>
          </div>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}