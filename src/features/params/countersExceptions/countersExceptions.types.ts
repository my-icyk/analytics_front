export type Counter = {
  id: number;
  exception_count: number;
  last_change: string;
};

export type CounterException = {
  id: number;
  counter_id: number;
  valid_from: string;
  valid_to: string;
  visitors: string;
  is_auto: boolean;
  reason: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type CounterExceptionCreate = {
  counter_id: number;
  valid_from: string;
  valid_to: string;
  visitors: string;
  is_auto: boolean;
  reason: string;
};

export type CounterExceptionUpdate = CounterExceptionCreate;
