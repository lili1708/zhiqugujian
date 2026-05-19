import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

interface Building {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  image?: string;
  created_at: string;
}

const { TextArea } = Input;

const categories = [
  { value: ' palace', label: '宫殿' },
  { value: 'temple', label: '寺庙' },
  { value: 'garden', label: '园林' },
  { value: 'tower', label: '塔楼' },
  { value: 'wall', label: '城墙' },
  { value: 'other', label: '其他' },
];

export default function BuildingManage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setBuildings(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Building) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('buildings').delete().eq('id', id);
      if (error) throw error;
      message.success('删除成功');
      fetchBuildings();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        const { error } = await supabase
          .from('buildings')
          .update(values)
          .eq('id', editingId);
        if (error) throw error;
        message.success('更新成功');
      } else {
        const { error } = await supabase.from('buildings').insert(values);
        if (error) throw error;
        message.success('添加成功');
      }
      
      setModalVisible(false);
      fetchBuildings();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: '名称', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => <b>{text}</b>
    },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '地址', dataIndex: 'location', key: 'location' },
    { 
      title: '操作', 
      key: 'action',
      width: 180,
      render: (_: any, record: Building) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    },
  ];

  return (
    <div className="building-manage">
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加古建
        </Button>
      </div>

      <Table
        dataSource={buildings}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? '编辑古建' : '添加古建'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select options={categories} />
          </Form.Item>
          <Form.Item name="location" label="地址">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="介绍">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}