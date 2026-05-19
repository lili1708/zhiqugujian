import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Tag, Modal, Image, message } from 'antd'
import { supabase } from '../lib/supabase'

type Post = {
  id: number
  user_id: string
  user_name: string
  content: string
  images: string[]
  status: string
  created_at: string
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [operateLoading, setOperateLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            id,
            user_id,
            content,
            images,
            status,
            created_at
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          message.error(`加载失败: ${error.message}`)
          return
        }

        if (!postsData || postsData.length === 0) {
          setPosts([])
          return
        }

        const postsWithUserInfo = await Promise.all(
          postsData.map(async (post) => {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', post.user_id)
              .single()

            if (profileError) {
              console.warn('Profile fetch error:', profileError)
            }

            return {
              id: post.id,
              user_id: post.user_id,
              user_name: profile?.username || '未知用户',
              content: post.content,
              images: post.images || [],
              status: post.status,
              created_at: post.created_at,
            }
          })
        )

        setPosts(postsWithUserInfo)
      } catch (e) {
        console.error('Error fetching posts:', e)
        message.error(`加载失败: ${(e as Error).message}`)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleApprove = async (postId: number) => {
    setOperateLoading(true)
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'approved' })
        .eq('id', postId)

      if (error) {
        console.error('Approve error:', error)
        message.error(`审核失败: ${error.message}`)
        return
      }

      setPosts(posts.map(p => p.id === postId ? { ...p, status: 'approved' } : p))
      message.success('审核通过')
    } catch (e) {
      console.error('Approve error:', e)
      message.error(`审核失败: ${(e as Error).message}`)
    } finally {
      setOperateLoading(false)
    }
  }

  const handleReject = async (postId: number) => {
    setOperateLoading(true)
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'rejected' })
        .eq('id', postId)

      if (error) {
        console.error('Reject error:', error)
        message.error(`拒绝失败: ${error.message}`)
        return
      }

      setPosts(posts.map(p => p.id === postId ? { ...p, status: 'rejected' } : p))
      message.success('已拒绝')
    } catch (e) {
      console.error('Reject error:', e)
      message.error(`拒绝失败: ${(e as Error).message}`)
    } finally {
      setOperateLoading(false)
    }
  }

  const handleView = (post: Post) => {
    setSelectedPost(post)
    setModalVisible(true)
  }

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 60
    },
    { 
      title: '作者', 
      dataIndex: 'user_name', 
      key: 'user_name' 
    },
    { 
      title: '内容', 
      dataIndex: 'content', 
      key: 'content',
      ellipsis: true,
      maxLength: 50
    },
    { 
      title: '图片数量', 
      dataIndex: 'images', 
      key: 'images',
      render: (images: string[]) => images.length,
      width: 100
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'yellow' : 'red'}>
          {status === 'approved' ? '已通过' : status === 'pending' ? '待审核' : '已拒绝'}
        </Tag>
      )
    },
    { 
      title: '操作', 
      key: 'actions',
      width: 200,
      render: (_, record: Post) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            size="small" 
            onClick={() => handleView(record)}
            disabled={operateLoading}
          >
            查看
          </Button>
          {record.status !== 'approved' && (
            <Button 
              size="small" 
              type="primary" 
              onClick={() => handleApprove(record.id)}
              loading={operateLoading}
            >
              通过
            </Button>
          )}
          {record.status !== 'rejected' && (
            <Button 
              size="small" 
              danger 
              onClick={() => handleReject(record.id)}
              loading={operateLoading}
            >
              拒绝
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div>
      <Card title="内容审核">
        <Table 
          dataSource={posts} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="帖子详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedPost && (
          <div>
            <p><strong>作者:</strong> {selectedPost.user_name}</p>
            <p><strong>状态:</strong> {selectedPost.status === 'approved' ? '已通过' : selectedPost.status === 'pending' ? '待审核' : '已拒绝'}</p>
            <p><strong>发布时间:</strong> {new Date(selectedPost.created_at).toLocaleString()}</p>
            <hr />
            <p><strong>内容:</strong></p>
            <p>{selectedPost.content}</p>
            {selectedPost.images && selectedPost.images.length > 0 && (
              <div>
                <p><strong>图片:</strong></p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {selectedPost.images.map((img, i) => (
                    <Image key={i} src={img} alt={`图片${i+1}`} width="100%" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
