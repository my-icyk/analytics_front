import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// components/EntityTable.tsx
type Props<T> = {
  columns: ProColumns<T>[];
  data: T[];
  loading: boolean;
  createLabel: string;
  onCreate: () => void;
  onFilter: (params: Partial<T>) => void;
  onReset: () => void;
};

export function EntityTable<T extends { id: number }>(p: Props<T>) {
  return (
    <ProTable<T>
      rowKey="id"
      columns={p.columns}
      dataSource={p.data}
      loading={p.loading}
      search={{ labelWidth: "auto", searchText: "Filter", resetText: "Reset" }}
      onSubmit={(params) => p.onFilter(params as Partial<T>)}
      onReset={p.onReset}
      toolBarRender={() => [
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={p.onCreate}
        >
          {p.createLabel}
        </Button>,
      ]}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
}
