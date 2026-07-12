import React from 'react'
export default function MemoryCandidatePanel({ phase, promise, candidates, onApprove }) {
  if (phase !== 'aftercare') return null
  return <section style={{ maxWidth: 900, margin: '16px auto', padding: 16, borderRadius: 12, background: '#142d2b', color: '#d9fbe9' }}><strong>Narrative promise · {promise.status}</strong><p style={{ fontSize: 13 }}>{promise.expectedPayoff}</p><div style={{ fontSize: 12, color: '#a7d8cf' }}>Nothing is written to long-term memory automatically.</div>{candidates.map((item) => <div key={item.id} style={{ marginTop: 10, padding: 10, border: '1px solid #3b6b63', borderRadius: 8 }}><span>{item.summary}</span><button onClick={() => onApprove(item.id)} disabled={item.approved} style={{ marginLeft: 10, padding: '5px 9px', borderRadius: 7 }}>{item.approved ? 'Approved for export' : 'Approve candidate'}</button></div>)}</section>
}
