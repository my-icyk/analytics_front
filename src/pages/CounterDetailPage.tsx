import { ArrowLeft, Edit3 } from 'lucide-react'
import type { Counter } from '../types/counter'

type CounterDetailPageProps = {
  counter: Counter
  canEdit: boolean
  onBack: () => void
  onEdit: () => void
  error: string
}

export function CounterDetailPage({ counter, canEdit, onBack, onEdit, error }: CounterDetailPageProps) {
  return <section className="detail-page">
    <button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to counters</button>
    <div className="detail-header"><div><p className="eyebrow">COUNTER DETAILS</p><h2>Counter {counter.id_counter}</h2><p className="subtitle">Record ID {counter.id} · {counter.auto ? 'Auto' : 'Manual'}</p></div>{canEdit && <button className="secondary-button" onClick={onEdit}><Edit3 size={15} /> Edit counter</button>}</div>
    {error && <p className="auth-error">{error}</p>}
    <div className="document">
      <div className="document-field"><span className="document-label">Counter ID</span><span className="document-value">{counter.id_counter}</span></div>
      <div className="document-field"><span className="document-label">Amount</span><span className="document-value">{counter.amount}</span></div>
      <div className="document-field"><span className="document-label">Start date</span><span className="document-value">{counter.start_date}</span></div>
      <div className="document-field"><span className="document-label">End date</span><span className="document-value">{counter.end_date}</span></div>
      <div className="document-field"><span className="document-label">Mode</span><span className="document-value">{counter.auto ? 'Auto' : 'Manual'}</span></div>
      <div className="document-field"><span className="document-label">Comment</span><p className="document-value">{counter.comment || 'No comment provided.'}</p></div>
    </div>
  </section>
}
