import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Badge } from 'antd';
import { EditOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export default function UserManage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: UserProfile) => {
    setSelectedUser(record);
    setDetailVisible(true);
  };

  const handleEdit = (record: UserProfile) => {
    setSelectedUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', selectedUser?.id);
        
      if (error) throw error;
      message.success('更新成功');
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      message.error('更新失败');
    }
  };

  const handleDisable = async (_id: string) => {
    // TODO: 实现禁用用户功能
    message.success('已禁用该用户');
  };

  const columns = [
    { 
      title: '用户', 
      key: 'user',
      width: 200,
      render: (_: any, record: UserProfile) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0', overflow: 'hidden' }}>
            {record.avatar_url ? (
              <img src={record.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                {record.username?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.username || '未设置'}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.id.slice(0, 8)}...</div>
          </div>
        </div>
      )
    },
    { title: '简介', dataIndex: 'bio', key: 'bio', ellipsis: true },
    { 
      title: '注册时间', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleDateString('zh-CN')
    },
    { 
      title: '状态', 
      key: 'status',
      render: () => <Badge status="success" text="正常" />
    },
    { 
      title: '操作', 
      key: 'action',
      width: 200,
      render: (_: any, record: UserProfile) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<StopOutlined />} onClick={() => handleDisable(record.id)}>
            禁用
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="user-manage">
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* 编辑弹窗 */}
      <Modal
        title="编辑用户"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="昵称">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="简介">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0f0f0', margin: '0 auto 12px', overflow: 'hidden' }}>
                {selectedUser.avatar_url ? (
                  <img src={selectedUser.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 32 }}>
                    {selectedUser.username?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <h3>{selectedUser.username || '未设置'}</h3>
            </div>
            <p><b>简介：</b>{selectedUser.bio || '暂无'}</p>
            <p><b>用户ID：</b>{selectedUser.id}</p>
            <p><b>注册时间：</b>{new Date(selectedUser.created_at).toLocaleString('zh-CN')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}