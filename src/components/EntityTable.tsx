import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useLocalFilter } from "@/hooks/useLocalFilter";

// components/EntityTable.tsx
type Props<T> = {
  columns: ProColumns<T>[];
  data: T[];
  loading: boolean;
  createLabel: string;
  onCreate: () => void;
};

export function EntityTable<T extends { id: number }>(p: Props<T>) {
  const { rows, setFilters, resetFilters } = useLocalFilter(p.data);
  return (
    <ProTable<T>
      rowKey="id"
      columns={p.columns}
      dataSource={rows}
      loading={p.loading}
      form={{ syncToUrl: true }}
      search={{ labelWidth: "auto", searchText: "Filter", resetText: "Reset" }}
      onSubmit={(params) => setFilters(params as Partial<T>)}
      onReset={resetFilters}
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
