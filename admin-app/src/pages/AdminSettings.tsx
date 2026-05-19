import React, { useEffect, useState } from 'react'
import { Card, Form, Input } from 'antd'
import { supabase } from '../lib/supabase'

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await supabase.from('settings').select('*').limit(1)
        setSettings(data?.[0] || {})
      } catch (e) {
        console.error('Error fetching settings:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <Card title="系统设置">
      <Form layout="vertical" initialValues={settings}>
        <Form.Item label="站点名称" name="siteName">
          <Input defaultValue={settings.siteName || ''} />
        </Form.Item>
      </Form>
    </Card>
  )
}
