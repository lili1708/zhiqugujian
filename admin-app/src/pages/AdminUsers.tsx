import React, { useEffect, useState } from 'react'
import { Table, Card, Switch } from 'antd'
import { supabase } from '../lib/supabase'

type User = { id: string; username: string; email?: string; active: boolean }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const { data } = await supabase.from('profiles').select('*')
        // Normalize to our User shape if needed
        const transformed = (data || []).map((u: any) => ({ id: u.id ?? u.user_id ?? '', username: u.username ?? '用户', email: u.email ?? '', active: true }))
        setUsers(transformed)
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '启用', dataIndex: 'active', key: 'active', render: (v: boolean) => <Switch checked={v} readOnly /> }
  ]

  return (
    <Card title="用户管理">
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} pagination={false} />
    </Card>
  )
}
