import { Rule } from "@/types/rules";
import { ProColumns } from "@ant-design/pro-components";
import {
  stringSorter,
  numberSorter,
  dateSorterNullAsMax,
  dateSorter,
} from "@/utils/sorters";
import { Button, Tooltip } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { EditActionButton } from "@/components/EditActionButton";

export const getColumns = (
  onEdit: (record: Rule) => void,
  onDelete: (id: number) => void,
  onOpenTargets: (record: Rule) => void,
): ProColumns<Rule>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: false,
    sorter: numberSorter<Rule>("id"),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    search: true,
    sorter: stringSorter<Rule>("name"),
    valueType: "text",
  },

  {
    title: "Valid From",
    dataIndex: "valid_from",
    key: "valid_from",
    search: false,
    sorter: dateSorter<Rule>("valid_from"),
    valueType: "date",
  },
  {
    title: "Valid To",
    dataIndex: "valid_to",
    key: "valid_to",
    search: false,
    sorter: dateSorterNullAsMax<Rule>("valid_to"),
    valueType: "date",
  },
  {
    title: "Percentage",
    dataIndex: "percent_value",
    key: "percent_value",
    search: false,
    sorter: numberSorter<Rule>("percent_value"),
    valueType: "digit",
    render: (_, record) => `${record.percent_value.toFixed(2)}%`,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    search: false,
    width: 120,
    align: "right",
    fixed: "right",
    render: (_, record) => [
      <Tooltip key="targets" title="Targets">
        <Button
          type="text"
          size="small"
          icon={<ApartmentOutlined />}
          aria-label={`Targets of ${record.name}`}
          onClick={() => onOpenTargets(record)}
        />
      </Tooltip>,
      <EditActionButton
        key="edit"
        itemLabel={record.name}
        onClick={() => onEdit(record)}
      />,

      <DeleteActionButton
        key="delete"
        entityName="rule"
        itemLabel={record.name}
        onConfirm={() => onDelete(record.id)}
      />,
    ],
  },
];
