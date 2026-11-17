import { getEmployee } from "@/services/hr";
import { PageContainer } from "@ant-design/pro-components";
import { useAccess, useParams, useRequest } from "@umijs/max";
import {
  Card,
  Descriptions,
  Empty,
  Flex,
  Skeleton,
  Tabs,
  Tag,
  Typography,
} from "antd";

import type { TabsProps } from "antd";

import type { Employee } from "@/types/hr";

import CreditsTab from "./tabs/CreditsTab";
import { PERMISSIONS } from "../../../../../config/permissions";

function EmployeeInfoCard({
  employee,
  loading,
}: {
  employee?: Employee;
  loading: boolean;
}) {
  if (loading || !employee) {
    return (
      <Card>
        <Skeleton avatar active paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <Flex gap={16} align="center" style={{ marginBottom: 24 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {employee.name}
        </Typography.Title>
        <Flex gap={8} align="center">
          <Tag color="blue">{employee.id}</Tag>
        </Flex>
      </Flex>

      <Descriptions colon={false}>
        <Descriptions.Item label="Employee ref">
          <Typography.Text copyable>{employee.employee_ref}</Typography.Text>
        </Descriptions.Item>

        <Descriptions.Item label="Fiscal code">
          <Typography.Text copyable>{employee.fiscal_code}</Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Department">
          {employee.department_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email / UPN">
          <Typography.Link href={`mailto:${employee.user_principal_name}`}>
            {employee.user_principal_name}
          </Typography.Link>
        </Descriptions.Item>
        <Descriptions.Item label="Username">
          <Typography.Text copyable>{employee.user_name}</Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Purchase limit">
          <Typography.Text copyable>{employee.purchase_limit}</Typography.Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { can } = useAccess();
  const canReadCredits = can(PERMISSIONS.HR.CREDITS.READ);

  const { data: employee, loading } = useRequest(() => getEmployee(id!), {
    ready: !!id,
    refreshDeps: [id],
  });

  const tabItems: TabsProps["items"] = [
    ...(canReadCredits
      ? [
          {
            key: "credits",
            label: "Credits",
            children: <CreditsTab employee_id={Number(id)} />,
          },
        ]
      : []),
    // future tabs go here, each with its own permission check
  ];

  return (
    <PageContainer title={false}>
      <EmployeeInfoCard employee={employee} loading={loading} />

      {tabItems.length > 0 ? (
        <Card>
          <Tabs items={tabItems} />
        </Card>
      ) : (
        <Card>
          <Empty description="You don't have access to any sections of this employee" />
        </Card>
      )}
    </PageContainer>
  );
}
