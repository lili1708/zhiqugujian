import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  CheckCircleOutlined,
  RiseOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalUsers: number;
  totalBuildings: number;
  totalCheckIns: number;
  todayCheckIns: number;
}

interface RecentActivity {
  id: number;
  type: 'checkin' | 'user' | 'like';
  content: string;
  time: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBuildings: 0,
    totalCheckIns: 0,
    todayCheckIns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [usersRes, buildingsRes, checkInsRes, todayRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('buildings').select('id', { count: 'exact', head: true }),
        supabase.from('check_ins').select('id', { count: 'exact', head: true }),
        supabase.from('check_ins').select('id', { count: 'exact', head: true })
          .gte('created_at', today)
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalBuildings: buildingsRes.count || 0,
        totalCheckIns: checkInsRes.count || 0,
        todayCheckIns: todayRes.count || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities: RecentActivity[] = [
    { id: 1, type: 'checkin', content: '用户在故宫太和殿打卡', time: '5分钟前' },
    { id: 2, type: 'user', content: '新用户注册: 张三', time: '10分钟前' },
    { id: 3, type: 'like', content: '一条动态获得点赞', time: '15分钟前' },
    { id: 4, type: 'checkin', content: '用户在天坛祈年殿打卡', time: '20分钟前' },
    { id: 5, type: 'user', content: '新用户注册: 李四', time: '30分钟前' },
  ];

  const columns = [
    { title: '操作', dataIndex: 'type', key: 'type',
      render: (type: string) => {
        const icons: Record<string, any> = {
          checkin: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          user: <UserOutlined style={{ color: '#1890ff' }} />,
          like: <HeartOutlined style={{ color: '#e63946' }} />
        };
        return icons[type] || <UserOutlined />;
      }
    },
    { title: '内容', dataIndex: 'content', key: 'content' },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ];

  return (
    <div className="dashboard">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="古建数量"
              value={stats.totalBuildings}
              prefix={<EnvironmentOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总打卡数"
              value={stats.totalCheckIns}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日打卡"
              value={stats.todayCheckIns}
              prefix={<RiseOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近动态" style={{ marginTop: 24 }}>
        <Table
          dataSource={recentActivities}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}