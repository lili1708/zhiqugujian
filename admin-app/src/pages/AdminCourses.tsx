import React, { useEffect, useState, useCallback } from 'react'
import { Card, Table, Button, Input, Select, message, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, XOutlined, UploadOutlined } from '@ant-design/icons'
import { supabase } from '../lib/supabase'

type Course = {
  id: number
  title: string
  description: string
  media_url: string
  media_type: 'image' | 'video'
  category: string
  duration: number
  created_at: string
}

const categories = [
  { value: 'structure', label: '建筑结构' },
  { value: 'technique', label: '建造技艺' },
  { value: 'design', label: '设计艺术' },
  { value: 'decoration', label: '装饰艺术' },
  { value: 'history', label: '历史文化' },
]

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    category: '',
    duration: 0
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching courses:', error)
        message.error(`加载失败: ${error.message}`)
        return
      }
      setCourses(data || [])
    } catch (err) {
      console.error('Error fetching courses:', err)
      message.error(`加载失败: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    console.log('Add button clicked')
    setEditingCourse(null)
    setFormData({
      title: '',
      description: '',
      media_url: '',
      media_type: 'image',
      category: '',
      duration: 0
    })
    setModalVisible(true)
  }

  const handleEdit = (course: Course) => {
    console.log('Edit button clicked:', course.id)
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      media_url: course.media_url || '',
      media_type: course.media_type || 'image',
      category: course.category,
      duration: course.duration
    })
    setModalVisible(true)
  }

  const handleView = (course: Course) => {
    setSelectedCourse(course)
    setViewModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) {
        console.error('Delete error:', error)
        message.error(`删除失败: ${error.message}`)
        return
      }
      setCourses(courses.filter(c => c.id !== id))
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
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      message.error('请上传图片或视频文件')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const bucketName = isImage ? 'courses-images' : 'courses-videos'
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
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
        .from(bucketName)
        .getPublicUrl(fileName)

      setFormData(prev => ({ 
        ...prev, 
        media_url: publicUrl,
        media_type: isImage ? 'image' : 'video'
      }))
      message.success(`${isImage ? '图片' : '视频'}上传成功`)
    } catch (err) {
      console.error('Upload error:', err)
      message.error(`上传失败: ${(err as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      message.error('请输入标题')
      return
    }
    if (!formData.category) {
      message.error('请选择分类')
      return
    }
    if (!formData.duration || formData.duration <= 0) {
      message.error('请输入有效时长')
      return
    }

    try {
      if (editingCourse) {
        const { error } = await supabase.from('courses').update({
          title: formData.title,
          description: formData.description,
          media_url: formData.media_url,
          media_type: formData.media_type,
          category: formData.category,
          duration: formData.duration
        }).eq('id', editingCourse.id)
        if (error) {
          console.error('Update error:', error)
          message.error(`更新失败: ${error.message}`)
          return
        }
        setCourses(courses.map(c => c.id === editingCourse.id ? { 
          ...c, 
          title: formData.title,
          description: formData.description,
          media_url: formData.media_url,
          media_type: formData.media_type,
          category: formData.category,
          duration: formData.duration
        } : c))
        message.success('更新成功')
      } else {
        const { error } = await supabase.from('courses').insert({
          title: formData.title,
          description: formData.description,
          media_url: formData.media_url,
          media_type: formData.media_type,
          category: formData.category,
          duration: formData.duration
        })
        if (error) {
          console.error('Insert error:', error)
          message.error(`添加失败: ${error.message}`)
          return
        }
        fetchCourses()
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
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '分类', dataIndex: 'category', key: 'category', render: (cat: string) => categories.find(c => c.value === cat)?.label || cat },
    { title: '时长(分钟)', dataIndex: 'duration', key: 'duration' },
    { title: '类型', dataIndex: 'media_type', key: 'media_type', render: (type: string) => type === 'video' ? '视频' : '图片' },
    { 
      title: '操作', 
      key: 'actions',
      width: 200,
      render: (_, record: Course) => (
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
        title="课程管理" 
        extra={<Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>添加课程</Button>}
      >
        <Table 
          dataSource={courses} 
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
              <h2 style={{ margin: 0 }}>{editingCourse ? '编辑课程' : '添加课程'}</h2>
              <Button icon={<XOutlined />} onClick={() => setModalVisible(false)} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>标题 *</label>
                <Input 
                  placeholder="请输入课程标题" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>分类 *</label>
                <Select 
                  options={categories} 
                  placeholder="请选择分类"
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>时长(分钟) *</label>
                <Input 
                  type="number" 
                  placeholder="请输入课程时长"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>媒体文件</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="course-media-upload"
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
                  onClick={() => document.getElementById('course-media-upload')?.click()}
                >
                  {uploading ? (
                    <p>上传中...</p>
                  ) : formData.media_url ? (
                    <div>
                      {formData.media_type === 'video' ? (
                        <video src={formData.media_url} controls width="100%" style={{ maxHeight: '200px', objectFit: 'contain' }}>
                          您的浏览器不支持视频播放
                        </video>
                      ) : (
                        <Image src={formData.media_url} alt="已上传" width="100%" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                      )}
                      <p style={{ marginTop: '8px', color: '#1890ff' }}>点击或拖拽更换{formData.media_type === 'video' ? '视频' : '图片'}</p>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
                      <p>点击或拖拽{formData.media_type === 'video' ? '视频' : '图片'}到此处上传</p>
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>支持 JPG、PNG、GIF 图片或 MP4 视频格式</p>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>描述</label>
                <Input.TextArea 
                  placeholder="请输入课程描述" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>确定</Button>
            </div>
          </div>
        </div>
      )}

      {/* 查看详情弹窗 */}
      {viewModalVisible && selectedCourse && (
        <div key="view-modal">
          <div key="view-overlay" style={overlayStyle} onClick={() => { setViewModalVisible(false); setSelectedCourse(null); }} />
          <div key="view-content" style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>课程详情</h2>
              <Button icon={<XOutlined />} onClick={() => { setViewModalVisible(false); setSelectedCourse(null); }} />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {selectedCourse.media_url && (
                selectedCourse.media_type === 'video' ? (
                  <video src={selectedCourse.media_url} controls width="100%" style={{ marginBottom: 16 }}>
                    您的浏览器不支持视频播放
                  </video>
                ) : (
                  <Image src={selectedCourse.media_url} alt={selectedCourse.title} width="100%" style={{ marginBottom: 16 }} />
                )
              )}
              <p><strong>标题:</strong> {selectedCourse.title}</p>
              <p><strong>分类:</strong> {categories.find(c => c.value === selectedCourse.category)?.label || selectedCourse.category}</p>
              <p><strong>时长:</strong> {selectedCourse.duration} 分钟</p>
              <p><strong>媒体类型:</strong> {selectedCourse.media_type === 'video' ? '视频' : '图片'}</p>
              <p><strong>描述:</strong></p>
              <p>{selectedCourse.description}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button onClick={() => { setViewModalVisible(false); setSelectedCourse(null); }}>关闭</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}