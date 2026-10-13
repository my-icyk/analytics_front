import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { fetchDashboardStats } from '@/services/dashboard';
import StatsRow from './components/StatsRow';

/**
 * Page = fetch data + compose components. Presentation lives in ./components.
 * `cacheKey` + `staleTime`: coming back to this page shows the cached
 * numbers instantly and only re-fetches after 30 seconds.
 *
 * IMPORTANT: Umi's useRequest assumes the backend answers `{ data: ... }`
 * and returns only `.data`. Our API answers with the plain object, so every
 * useRequest call needs `formatResult: (res) => res`.
 */
export default function DashboardPage() {
  const { data, loading } = useRequest(fetchDashboardStats, {
    formatResult: (res) => res,
    cacheKey: 'dashboard-stats',
    staleTime: 30_000,
  });

  return (
    <PageContainer>
      <StatsRow stats={data} loading={loading} />
    </PageContainer>
  );
}
