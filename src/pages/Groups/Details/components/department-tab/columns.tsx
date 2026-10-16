import { Button } from "antd";
import type { ProColumns } from "@ant-design/pro-components";

import type { Repartition } from "@/types/departments";
import { formatDate } from "@/utils/formatDate";
import {
  boolSorter,
  dateSorter,
  dateSorterNullAsMax,
  numberSorter,
  stringSorter,
} from "@/utils/sorters";

type GetColumnsParams = {
  onEdit: (record: Repartition) => void;
};

export function getColumns({
  onEdit,
}: GetColumnsParams): ProColumns<Repartition>[] {
  return [
    {
      title: "ID",
      dataIndex: "id",
      search: false,
      sorter: numberSorter<Repartition>("id"),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      valueType: "text",
      sorter: stringSorter<Repartition>("department_name"),
    },
    {
      title: "Valid From",
      dataIndex: "valid_from",
      search: false,
      sorter: dateSorter<Repartition>("valid_from"),
      render: (_, { valid_from }) => formatDate(valid_from),
    },
    {
      title: "Valid To",
      dataIndex: "valid_to",
      search: false,
      sorter: dateSorterNullAsMax<Repartition>("valid_to"),
      render: (_, { valid_to }) => formatDate(valid_to),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      width: 110,
      sorter: boolSorter<Repartition>("is_active"),
      valueEnum: {
        true: { text: "Active", status: "Success" },
        false: { text: "Inactive", status: "Default" },
      },
    },
    {
      title: "Actions",
      valueType: "option",
      width: 90,
      fixed: "right",
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          onClick={() => onEdit(record)}
        >
          Edit
        </Button>,
      ],
    },
  ];
}
