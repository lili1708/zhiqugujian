import React from 'react'

export default function AdminPlaceholder() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>管理后台占位</h2>
      <p>当前管理后台的完整界面正在维护中。请稍后再试，或联系开发人员开启调试模式。</p>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', background: '#e63946', color: '#fff', border: 'none', borderRadius: 6 }}>刷新</button>
        <a href="/admin" style={{ alignSelf: 'center' }}>返回上级</a>
      </div>
    </div>
  )
}
