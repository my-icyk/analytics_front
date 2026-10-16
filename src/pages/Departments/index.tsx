import { PageContainer } from "@ant-design/pro-components";
import { Card, Tabs } from "antd";
import DepartmentsTab from "./components/deparments-tab";

export default function DepartmentsPage() {
  return (
    <PageContainer>
      <Card>
        <Tabs
          items={[
            {
              key: "departments",
              label: "Departments",
              children: <DepartmentsTab />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}
