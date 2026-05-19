import { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, message, Popconfirm, Image, Tabs, Input } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

interface Post {
  id: number;
  user_id: string;
  building_id: number;
  note: string;
  image_url?: string;
  created_at: string;
  building?: { name: string };
  user?: { username: string };
}

interface Comment {
  id: number;
  user_id: string;
  check_in_id: number;
  content: string;
  created_at: string;
  user?: { username: string };
}

const { Search } = Input;

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Post | Comment | null>(null);

  useEffect(() => {
    if (activeTab === 'posts') fetchPosts();
    else fetchComments();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select('*, building:buildings(name), user:user_id(username)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user:user_id(username)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: Post | Comment) => {
    setSelectedItem(record);
    setDetailVisible(true);
  };

  const handleDeletePost = async (id: number) => {
    try {
      const { error } = await supabase.from('check_ins').delete().eq('id', id);
      if (error) throw error;
      message.success('删除成功');
      fetchPosts();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw error;
      message.success('删除成功');
      fetchComments();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const postColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户', key: 'user', render: (_: any, r: Post) => r.user?.username || '未知' },
    { title: '内容', dataIndex: 'note', key: 'note', ellipsis: true },
    { title: '图片', key: 'image', width: 60, render: (_: any, r: Post) => r.image_url ? <Image width={40} height={40} src={r.image_url} style={{objectFit:'cover',borderRadius:4}} /> : '-' },
    { title: '时间', dataIndex: 'created_at', key: 'created_at', render: (t: string) => new Date(t).toLocaleString('zh-CN') },
    { title: '操作', key: 'action', width: 120, render: (_: any, r: Post) => (
      <div style={{display:'flex',gap:8}}>
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(r)}>查看</Button>
        <Popconfirm title="确认删除？" onConfirm={() => handleDeletePost(r.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </div>
    )},
  ];

  const commentColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户', key: 'user', render: (_: any, r: Comment) => r.user?.username || '未知' },
    { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '时间', dataIndex: 'created_at', key: 'created_at', render: (t: string) => new Date(t).toLocaleString('zh-CN') },
    { title: '操作', key: 'action', width: 120, render: (_: any, r: Comment) => (
      <div style={{display:'flex',gap:8}}>
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(r)}>查看</Button>
        <Popconfirm title="确认删除？" onConfirm={() => handleDeleteComment(r.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </div>
    )},
  ];

  const tabItems = [
    { key: 'posts', label: '动态' },
    { key: 'comments', label: '评论' },
  ];

  return (
    <div className="content-moderation">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="搜索内容..." style={{ width: 300 }} />
        </div>
        {activeTab === 'posts' ? (
          <Table dataSource={posts} columns={postColumns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        ) : (
          <Table dataSource={comments} columns={commentColumns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
        )}
      </Card>
      <Modal title="内容详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null}>
        {selectedItem && <p>{(selectedItem as any).note || (selectedItem as any).content}</p>}
      </Modal>
    </div>
  );
}