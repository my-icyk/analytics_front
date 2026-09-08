export type Counter = {
  id: number
  start_date: string
  end_date: string
  id_counter: number
  amount: number
  auto: boolean
  comment: string
}

export type CounterPage = { items: Counter[]; next_cursor: number | null }
export type CounterCreate = Omit<Counter, 'id'>
export type CounterUpdate = Partial<CounterCreate>
