import React, { useEffect, useState } from 'react'
import { Card, Table } from 'antd'
import { supabase } from '../lib/supabase'

type CheckIn = { id: number; user: string; building: string; time: string }

export default function AdminCheckIns() {
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await supabase.from('check_ins').select('id, user:profiles(username), buildings(name), created_at')
        const mapped = (data || []).map((r: any) => ({ id: r.id, user: r.user?.username ?? 'unknown', building: r.buildings?.name ?? '', time: r.created_at ?? '' }))
        setCheckins(mapped)
      } catch (e) {
        console.error('Error fetching checkins:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const columns = [
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '古建', dataIndex: 'building', key: 'building' },
    { title: '时间', dataIndex: 'time', key: 'time' }
  ]

  return (
    <Card title="打卡管理">
      <Table dataSource={checkins} columns={columns} rowKey="id" loading={loading} pagination={false} />
    </Card>
  )
}
