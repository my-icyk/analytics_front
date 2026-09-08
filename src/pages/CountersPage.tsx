import { Plus } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable/DataTable'
import { counterService } from '../services/counterService'
import type { Counter } from '../types/counter'

type CountersPageProps = {
  canCreate: boolean
  canEdit: boolean
  onCreate: () => void
  onOpen: (counter: Counter) => void
  onEdit: (counter: Counter) => void
  error: string
}

export function CountersPage({ canCreate, canEdit, onCreate, onOpen, onEdit, error }: CountersPageProps) {
  const columns: DataTableColumn<Counter>[] = [
    { key: 'id_counter', header: 'Counter ID', render: (item) => <button className="link-button" onClick={() => onOpen(item)}><strong>{item.id_counter}</strong></button> },
    { key: 'amount', header: 'Amount', render: (item) => item.amount },
    { key: 'start_date', header: 'Start date', render: (item) => item.start_date },
    { key: 'end_date', header: 'End date', render: (item) => item.end_date },
    { key: 'auto', header: 'Mode', render: (item) => <span className={`status ${item.auto ? 'active' : 'draft'}`}><span />{item.auto ? 'Auto' : 'Manual'}</span> },
    { key: 'comment', header: 'Comment', render: (item) => item.comment || '—' },
    { key: 'actions', header: 'Actions', render: (item) => <div className="table-actions">{canEdit && <button className="secondary-button compact-button" onClick={() => onEdit(item)}>Edit</button>}</div> },
  ]

  return <section className="management-panel">
    <div className="section-heading"><div><h2>Counters</h2><p>Ledger counters synced from the backend.</p></div>{canCreate && <button className="primary-button" onClick={onCreate}><Plus size={17} /> New counter</button>}</div>
    <DataTable columns={columns} rowKey={(item) => item.id} fetchPage={(cursorId) => counterService.listCountersPage(cursorId)} emptyMessage="No counters available." error={error} />
  </section>
}
