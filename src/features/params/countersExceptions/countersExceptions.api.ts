import { request } from "../../../api/client";
import {
  Counter,
  CounterException,
  CounterExceptionCreate,
} from "./countersExceptions.types";
import { DEFAULT_API_PATH } from "../../shared/constants";
import { PaginatedResponse } from "../../shared/types";

const COUNTERS_URL = `${DEFAULT_API_PATH}/counters`;
const EXCEPTIONS_URL = `${DEFAULT_API_PATH}/counter-exceptions`;

export type ExceptionListParams = {
  counterId?: number;
  page: number;
  pageSize: number;
};

export function getCounters() {
  return request<Counter[]>(COUNTERS_URL);
}

export function getExceptionsByCounterID(counterId: number) {
  return request<CounterException[]>(`${COUNTERS_URL}/${counterId}/exceptions`);
}

export function getExceptions(
  { counterId, page, pageSize }: ExceptionListParams,
  signal?: AbortSignal,
) {
  const searchParams = new URLSearchParams({
    limit: String(pageSize),
    offset: String((page - 1) * pageSize),
  });
  if (counterId !== undefined) {
    searchParams.set("counter_id", String(counterId));
  }
  return request<PaginatedResponse<CounterException>>(
    `${EXCEPTIONS_URL}?${searchParams.toString()}`,
    { signal },
  );
}

export function getException(exceptionId: number) {
  return request<CounterException>(`${EXCEPTIONS_URL}/${exceptionId}`);
}

export function createException(payload: CounterExceptionCreate) {
  return request<void>(EXCEPTIONS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateException(
  exceptionId: number,
  payload: CounterExceptionCreate,
) {
  return request<void>(`${EXCEPTIONS_URL}/${exceptionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteException(exceptionId: number) {
  return request<void>(`${EXCEPTIONS_URL}/${exceptionId}`, {
    method: "DELETE",
  });
}
