import React, { useEffect, useState, useCallback } from 'react'
import { Card, Table, Button, Input, Select, message, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, XOutlined, UploadOutlined } from '@ant-design/icons'
import { supabase } from '../lib/supabase'

type Building = {
  id: number
  name: string
  location: string
  category: string
  description: string
  image: string
  rating: number
  checkin_count: number
  latitude?: number
  longitude?: number
  created_at: string
}

const categories = [
  { value: 'palace', label: '宫殿' },
  { value: 'garden', label: '园林' },
  { value: 'temple', label: '寺庙' },
  { value: 'tower', label: '塔楼' },
  { value: 'folk', label: '民居' },
  { value: 'other', label: '其他' },
]

export default function AdminBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: '',
    description: '',
    image: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    console.log('Fetching buildings...')
    setLoading(true)
    try {
      const { data, error } = await supabase.from('buildings').select('*').order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching buildings:', error)
        message.error(`加载失败: ${error.message}`)
        return
      }
      console.log('Buildings data:', data)
      setBuildings(data || [])
    } catch (err) {
      console.error('Error fetching buildings:', err)
      message.error(`加载失败: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    console.log('Add button clicked')
    setEditingBuilding(null)
    setFormData({
      name: '',
      location: '',
      category: '',
      description: '',
      image: '',
      latitude: '',
      longitude: ''
    })
    setModalVisible(true)
  }

  const handleEdit = (building: Building) => {
    console.log('Edit button clicked:', building.id)
    setEditingBuilding(building)
    setFormData({
      name: building.name,
      location: building.location,
      category: building.category,
      description: building.description || '',
      image: building.image || '',
      latitude: building.latitude?.toString() || '',
      longitude: building.longitude?.toString() || ''
    })
    setModalVisible(true)
  }

  const handleView = (building: Building) => {
    console.log('View button clicked:', building.id)
    setSelectedBuilding(building)
    setViewModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    console.log('Delete button clicked:', id)
    try {
      const { error } = await supabase.from('buildings').delete().eq('id', id)
      if (error) {
        console.error('Delete error:', error)
        message.error(`删除失败: ${error.message}`)
        return
      }
      setBuildings(buildings.filter(b => b.id !== id))
      message.success('删除成功')
    } catch (err) {
      console.error('Delete error:', err)
      message.error(`删除失败: ${(err as Error).message}`)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }, [])

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('请上传图片文件')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('buildings')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        message.error(`上传失败: ${uploadError.message}`)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('buildings')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, image: publicUrl }))
      message.success('图片上传成功')
    } catch (err) {
      console.error('Upload error:', err)
      message.error(`上传失败: ${(err as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    console.log('Submit button clicked')
    
    if (!formData.name || !formData.location || !formData.category) {
      message.error('请填写必填字段（名称、地点、分类）')
      return
    }

    try {
      const values = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }
      
      if (editingBuilding) {
        const { error } = await supabase.from('buildings').update(values).eq('id', editingBuilding.id)
        if (error) {
          console.error('Update error:', error)
          message.error(`更新失败: ${error.message}`)
          return
        }
        setBuildings(buildings.map(b => b.id === editingBuilding.id ? { ...b, ...values } : b))
        message.success('更新成功')
      } else {
        const { error } = await supabase.from('buildings').insert({ ...values, checkin_count: 0, rating: 0 })
        if (error) {
          console.error('Insert error:', error)
          message.error(`添加失败: ${error.message}`)
          return
        }
        fetchBuildings()
        message.success('添加成功')
      }
      setModalVisible(false)
    } catch (err) {
      console.error('Submit error:', err)
      message.error(`提交失败: ${(err as Error).message}`)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '地点', dataIndex: 'location', key: 'location' },
    { title: '分类', dataIndex: 'category', key: 'category', render: (cat: string) => categories.find(c => c.value === cat)?.label || cat },
    { title: '评分', dataIndex: 'rating', key: 'rating' },
    { title: '打卡数', dataIndex: 'checkin_count', key: 'checkin_count' },
    { 
      title: '操作', 
      key: 'actions',
      width: 200,
      render: (_, record: Building) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="small" onClick={() => handleView(record)} icon={<EyeOutlined />}>查看</Button>
          <Button size="small" type="primary" onClick={() => handleEdit(record)} icon={<EditOutlined />}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />}>删除</Button>
        </div>
      )
    }
  ]

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    zIndex: 1000,
    minWidth: '400px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999
  }

  const uploadZoneStyle: React.CSSProperties = {
    border: '2px dashed #d9d9d9',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }

  return (
    <div>
      <Card 
        title="古建管理" 
        extra={<Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>添加古建</Button>}
      >
        <Table 
          dataSource={buildings} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 添加/编辑弹窗 */}
      {modalVisible && (
        <div key="edit-modal">
          <div key="edit-overlay" style={overlayStyle} onClick={() => setModalVisible(false)} />
          <div key="edit-content" style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>{editingBuilding ? '编辑古建' : '添加古建'}</h2>
              <Button icon={<XOutlined />} onClick={() => setModalVisible(false)} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>名称 *</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="请输入古建筑名称" 
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>地点 *</label>
                <Input 
                  value={formData.location} 
                  onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                  placeholder="请输入地点" 
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>分类 *</label>
                <Select 
                  value={formData.category} 
                  onChange={(value) => setFormData(prev => ({...prev, category: value}))}
                  options={categories} 
                  placeholder="请选择分类" 
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>描述</label>
                <Input.TextArea 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="请输入描述" 
                  rows={3}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>图片</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="building-image-upload"
                />
                <div
                  style={{
                    ...uploadZoneStyle,
                    borderColor: isDragging ? '#1890ff' : '#d9d9d9',
                    backgroundColor: isDragging ? '#e6f7ff' : 'transparent'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('building-image-upload')?.click()}
                >
                  {uploading ? (
                    <p>上传中...</p>
                  ) : formData.image ? (
                    <div>
                      <Image src={formData.image} alt="已上传" width="100%" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                      <p style={{ marginTop: '8px', color: '#1890ff' }}>点击或拖拽更换图片</p>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
                      <p>点击或拖拽图片到此处上传</p>
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>支持 JPG、PNG、GIF 等格式</p>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>纬度</label>
                  <Input 
                    type="number"
                    value={formData.latitude} 
                    onChange={(e) => setFormData(prev => ({...prev, latitude: e.target.value}))}
                    placeholder="请输入纬度" 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>经度</label>
                  <Input 
                    type="number"
                    value={formData.longitude} 
                    onChange={(e) => setFormData(prev => ({...prev, longitude: e.target.value}))}
                    placeholder="请输入经度" 
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>确定</Button>
            </div>
          </div>
        </div>
      )}

      {/* 查看详情弹窗 */}
      {viewModalVisible && selectedBuilding && (
        <div key="view-modal">
          <div key="view-overlay" style={overlayStyle} onClick={() => { setViewModalVisible(false); setSelectedBuilding(null); }} />
          <div key="view-content" style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>古建详情</h2>
              <Button icon={<XOutlined />} onClick={() => { setViewModalVisible(false); setSelectedBuilding(null); }} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {selectedBuilding.image && (
                <Image src={selectedBuilding.image} alt={selectedBuilding.name} width="100%" style={{ marginBottom: 16 }} />
              )}
              <p><strong>名称:</strong> {selectedBuilding.name}</p>
              <p><strong>地点:</strong> {selectedBuilding.location}</p>
              <p><strong>分类:</strong> {categories.find(c => c.value === selectedBuilding.category)?.label || selectedBuilding.category}</p>
              <p><strong>评分:</strong> {selectedBuilding.rating}</p>
              <p><strong>打卡数:</strong> {selectedBuilding.checkin_count}</p>
              <p><strong>描述:</strong></p>
              <p>{selectedBuilding.description}</p>
              {selectedBuilding.latitude && selectedBuilding.longitude && (
                <p><strong>坐标:</strong> {selectedBuilding.latitude}, {selectedBuilding.longitude}</p>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button onClick={() => { setViewModalVisible(false); setSelectedBuilding(null); }}>关闭</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}