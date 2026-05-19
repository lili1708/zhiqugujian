import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spin, Table } from 'antd'
import { supabase } from '../lib/supabase'

type DailyStats = { date: string; checkIns: number; users: number }
type BuildingStats = { id: string; name: string; checkIns: number; image: string }

export default function AdminStats() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [buildingStats, setBuildingStats] = useState<BuildingStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const last7Days = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)
          last7Days.push(date.toISOString().split('T')[0])
        }

        const dailyData: DailyStats[] = []
        for (const dateStr of last7Days) {
          const nextDate = new Date(dateStr)
          nextDate.setDate(nextDate.getDate() + 1)
          
          const { count: checkIns, error: e1 } = await supabase
            .from('check_ins')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', `${dateStr}T00:00:00Z`)
            .lt('created_at', `${nextDate.toISOString().split('T')[0]}T00:00:00Z`)
          if (e1) throw e1

          const { count: users, error: e2 } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', `${dateStr}T00:00:00Z`)
            .lt('created_at', `${nextDate.toISOString().split('T')[0]}T00:00:00Z`)
          if (e2) throw e2

          dailyData.push({ date: dateStr, checkIns: checkIns ?? 0, users: users ?? 0 })
        }
        setDailyStats(dailyData)

        const { data: buildings, error: e3 } = await supabase
          .from('buildings')
          .select('id, name, image')
        if (e3) throw e3

        const buildingData: BuildingStats[] = []
        for (const building of buildings) {
          const { count: checkIns, error: e4 } = await supabase
            .from('check_ins')
            .select('id', { count: 'exact', head: true })
            .eq('building_id', building.id)
          if (e4) throw e4

          buildingData.push({
            id: building.id,
            name: building.name,
            checkIns: checkIns ?? 0,
            image: building.image ?? ''
          })
        }
        buildingData.sort((a, b) => b.checkIns - a.checkIns)
        setBuildingStats(buildingData)

      } catch (err) {
        console.error('AdminStats fetch error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin /></div>
    )
  }

  const dailyColumns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '打卡数', dataIndex: 'checkIns', key: 'checkIns' },
    { title: '新增用户', dataIndex: 'users', key: 'users' },
  ]

  const buildingColumns = [
    { title: '古建筑名称', dataIndex: 'name', key: 'name' },
    { title: '打卡次数', dataIndex: 'checkIns', key: 'checkIns' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据统计</h2>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="近7日打卡趋势">
            <Table 
              dataSource={dailyStats} 
              columns={dailyColumns} 
              pagination={false}
              rowKey="date"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="古建筑打卡排行">
            <Table 
              dataSource={buildingStats} 
              columns={buildingColumns} 
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
