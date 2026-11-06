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
import { PERMISSIONS } from "../../../../../../config/permissions";
import { Can } from "@/access";
import { periodColumn } from "@/components/columns";

export const getColumns = (
  can: Can,
  onEdit: (record: Rule) => void,
  onDelete: (id: number) => void,
  onOpenTargets: (record: Rule) => void,
): ProColumns<Rule>[] => {
  const canEdit = can(PERMISSIONS.FINANCE.RULE.UPDATE);
  const canDelete = can(PERMISSIONS.FINANCE.RULE.DELETE);
  const canManageTargets = can(PERMISSIONS.FINANCE.RULE_TARGET.READ);
  return [
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

    periodColumn<Rule>({ sortable: true }),
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
        canManageTargets && (
          <Tooltip key="targets" title="Targets">
            <Button
              type="text"
              size="small"
              icon={<ApartmentOutlined />}
              aria-label={`Targets of ${record.name}`}
              onClick={() => onOpenTargets(record)}
            />
          </Tooltip>
        ),
        canEdit && (
          <EditActionButton
            key="edit"
            itemLabel={record.name}
            onClick={() => onEdit(record)}
          />
        ),

        canDelete && (
          <DeleteActionButton
            key="delete"
            entityName="rule"
            itemLabel={record.name}
            onConfirm={() => onDelete(record.id)}
          />
        ),
      ],
    },
  ];
};
