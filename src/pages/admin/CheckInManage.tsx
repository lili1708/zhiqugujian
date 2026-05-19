import { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, message, Popconfirm, Tag, Image } from 'antd';
import { EyeOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

interface CheckInRecord {
  id: number;
  user_id: string;
  building_id: number;
  note?: string;
  image_url?: string;
  created_at: string;
  building?: { name: string };
  user?: { username: string };
}

export default function CheckInManage() {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInRecord | null>(null);

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select(`
          *,
          building:buildings(name),
          user:user_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCheckIns(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: CheckInRecord) => {
    setSelectedCheckIn(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('check_ins').delete().eq('id', id);
      if (error) throw error;
      message.success('删除成功');
      fetchCheckIns();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleExport = () => {
    const data = checkIns.map(c => ({
      用户: c.user?.username,
      古建: c.building?.name,
      备注: c.note,
      时间: c.created_at
    }));
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checkins.csv';
    a.click();
    message.success('导出成功');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: '用户', 
      key: 'user',
      render: (_: any, record: CheckInRecord) => record.user?.username || '未知'
    },
    { 
      title: '古建', 
      key: 'building',
      render: (_: any, record: CheckInRecord) => (
        <Tag color="blue">{record.building?.name || '未知'}</Tag>
      )
    },
    { 
      title: '备注', 
      dataIndex: 'note', 
      key: 'note',
      ellipsis: true,
      render: (text: string) => text || '-'
    },
    { 
      title: '图片', 
      key: 'image',
      width: 80,
      render: (_: any, record: CheckInRecord) => (
        record.image_url ? (
          <Image width={50} height={50} src={record.image_url} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : '-'
      )
    },
    { 
      title: '时间', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString('zh-CN')
    },
    { 
      title: '操作', 
      key: 'action',
      width: 120,
      render: (_: any, record: CheckInRecord) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
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
    <div className="checkin-manage">
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ExportOutlined />} onClick={handleExport}>
          导出数据
        </Button>
      </div>

      <Table
        dataSource={checkIns}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="打卡详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedCheckIn && (
          <div>
            <Card size="small">
              <p><b>用户：</b>{selectedCheckIn.user?.username || '未知'}</p>
              <p><b>古建：</b>{selectedCheckIn.building?.name || '未知'}</p>
              <p><b>备注：</b>{selectedCheckIn.note || '无'}</p>
              <p><b>时间：</b>{new Date(selectedCheckIn.created_at).toLocaleString('zh-CN')}</p>
              {selectedCheckIn.image_url && (
                <div style={{ marginTop: 12 }}>
                  <b>图片：</b>
                  <Image width="100%" src={selectedCheckIn.image_url} style={{ marginTop: 8, borderRadius: 8 }} />
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}