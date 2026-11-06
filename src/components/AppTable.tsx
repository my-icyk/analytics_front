import { ProTable, type ProTableProps } from "@ant-design/pro-components";

export function AppTable<
  T extends Record<string, any>,
  P extends Record<string, any> = Record<string, any>,
>(props: ProTableProps<T, P>) {
  const { pagination, ...rest } = props;

  return (
    <ProTable<T, P>
      rowKey="id"
      search={{ labelWidth: "auto", defaultCollapsed: false }}
      options={{ density: true, setting: true }}
      form={{ syncToUrl: true }}

      {...rest}
      pagination={
        pagination === false
          ? false
          : {
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              ...pagination,
            }
      }
    />
  );
}
