export type Procedure = {
  id: number;
  name: string;
  exec_order: number;
  is_active: boolean;
  last_run: string | null;
  last_status: string | null;
  last_duration_ms: number | null;
  last_error: string | null;
};

export type ProcedureHistory = {
  procedure_id: number;
  start_at: string;
  end_at: string | null;
  execution_time_ms: number | null;
  status: string | null;
  error_Detail: string | null;
};

export type ProcedureCreate = {
  name: string;
  exec_order: number;
};

export type ProcedureUpdate = ProcedureCreate & {
  is_active: boolean;
};
