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
// Backend PUT replaces the whole record, so an update payload is shaped exactly like create.
export type CounterUpdate = CounterCreate
