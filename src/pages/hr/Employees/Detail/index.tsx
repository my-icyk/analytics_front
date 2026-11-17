import { getEmployee } from "@/services/hr";
import { PageContainer } from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import { useParams } from "@umijs/max";
import { Card, Tabs } from "antd";
import CreditsTab from "./tabs/CreditsTab";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: employee, loading } = useRequest(() => getEmployee(id!), {
    ready: !!id,
    refreshDeps: [id],
  });

  return (
    <PageContainer title={`Employee: ${employee?.name}`} loading={loading}>
      <Tabs
        items={[
          {
            key: "credits",
            label: "Credits",
            children: <CreditsTab employee_id={Number(id)} />,
          },
        ]}
      />
    </PageContainer>
  );
}
