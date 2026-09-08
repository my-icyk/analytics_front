import { ArrowLeft } from 'lucide-react'
import type { Counter } from '../types/counter'

type CounterDetailPageProps = {
  counter: Counter
  onBack: () => void
  error: string
}

export function CounterDetailPage({ counter, onBack, error }: CounterDetailPageProps) {
  return <section className="detail-page">
    <button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to counters</button>
    <div className="detail-header"><div><p className="eyebrow">COUNTER DETAILS</p><h2>Counter {counter.id_counter}</h2><p className="subtitle">Record ID {counter.id} · {counter.auto ? 'Auto' : 'Manual'}</p></div></div>
    {error && <p className="auth-error">{error}</p>}
    <div className="detail-grid">
      <div className="detail-card"><span className="stat-label">Amount</span><strong>{counter.amount}</strong><p>Current tracked amount for this counter.</p></div>
      <div className="detail-card"><span className="stat-label">Period</span><strong>{counter.start_date} → {counter.end_date}</strong><p>Active window for this counter.</p></div>
      <div className="detail-card"><span className="stat-label">Mode</span><strong>{counter.auto ? 'Automatic' : 'Manual'}</strong><p>{counter.auto ? 'Updated automatically by the backend.' : 'Requires manual updates.'}</p></div>
      <div className="detail-card"><span className="stat-label">Comment</span><strong>{counter.comment || 'No comment'}</strong><p>Free-form note attached to this counter.</p></div>
    </div>
  </section>
}
