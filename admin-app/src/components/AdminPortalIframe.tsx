import React from 'react'

export default function AdminPortalIframe() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="/admin.html"
        title="Admin Portal"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  )
}
