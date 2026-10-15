import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useMemo, useRef, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/app";
import { getDivisions, deleteDivision } from "@/services/divisions";
import type { Division } from "@/types/divisions";
import { getColumns } from "./columns";

import { useAccess } from "@umijs/max";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DivisionFormModal from "./DivisionFormModal";
import { history } from "@umijs/max";

export default function DivisionsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const access = useAccess();

  const canDeleteGroup = access["finance:group:delete"];

  const actionRef = useRef<ActionType>();

  const handleDelete = async (id: number) => {
    try {
      await deleteDivision(id); // Your API function

      message.success("Division deleted successfully");

      actionRef.current?.reload();
    } catch {
      message.error("Failed to delete division");
    }
  };

  const handleViewGroups = (divisionId: number) => {
    history.push(`groups?division_ids=${divisionId}`);
  };

  const columns = useMemo(
    () => getColumns(handleDelete, handleViewGroups),
    [canDeleteGroup],
  );
  return (
    <PageContainer>
      <ProTable<Division>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        form={{ syncToUrl: true }}
        search={{
          labelWidth: "auto",
          searchText: "Filter",
          resetText: "Reset",
        }}

        tableLayout="auto"
        pagination={{
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          showTotal: (total) => `Total ${total} items`,
          showSizeChanger: true,
        }}
        request={async (params) => {
          // 1. load everything (no pagination params sent to the backend)
          const all = await getDivisions(); // returns Division[]

          // 2. front-side filters (skip pageSize/current, they are for pagination)
          const { current, pageSize, ...filters } = params;

          const data = all.filter((row) =>
            Object.entries(filters).every(([key, value]) => {
              if (value === undefined || value === null || value === "")
                return true;
              const cell = (row as Record<string, unknown>)[key];
              if (typeof cell === "string") {
                return cell.toLowerCase().includes(String(value).toLowerCase());
              }
              return cell === value;
            }),
          );

          // 3. no `total` -> ProTable paginates the array itself
          return { data, success: true };
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Create Division
          </Button>,
        ]}
      />
      <DivisionFormModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
