import { request } from '@umijs/max';
import type { DashboardStats } from '@/types/dashboard';

export function fetchDashboardStats() {
  return request<DashboardStats>('/api/v1/users');
}
