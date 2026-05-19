import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spin } from 'antd'
import { supabase } from '../lib/supabase'

type Stats = { users: number; buildings: number; checkIns: number; today: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, buildings: 0, checkIns: 0, today: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date()
        today.setHours(0,0,0,0)
        const todayIso = today.toISOString()
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        const tomorrowIso = tomorrow.toISOString()

        const { count: users, error: e1 } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
        if (e1) { throw e1 }

        const { count: buildings, error: e2 } = await supabase
          .from('buildings')
          .select('id', { count: 'exact', head: true })
        if (e2) { throw e2 }

        const { count: totalChecks, error: e3 } = await supabase
          .from('check_ins')
          .select('id', { count: 'exact', head: true })
        if (e3) { throw e3 }

        const { count: todayChecks, error: e4 } = await supabase
          .from('check_ins')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', todayIso)
          .lt('created_at', tomorrowIso)
        if (e4) { throw e4 }

        setStats({ users: users ?? 0, buildings: buildings ?? 0, checkIns: totalChecks ?? 0, today: todayChecks ?? 0 })
      } catch (err) {
        console.error('AdminDashboard fetch error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', padding:40 }}><Spin /></div>
    )
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card title="总用户" bordered={false}>{stats.users}</Card></Col>
        <Col span={6}><Card title="古建总数" bordered={false}>{stats.buildings}</Card></Col>
        <Col span={6}><Card title="总打卡" bordered={false}>{stats.checkIns}</Card></Col>
        <Col span={6}><Card title="今日打卡" bordered={false}>{stats.today}</Card></Col>
      </Row>
    </div>
  )
}
