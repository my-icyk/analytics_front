import { ProColumns } from "@ant-design/pro-components";
import type { Division } from "@/types/divisions";
import { useAccess } from "@umijs/max";
import { PERMISSIONS } from "../../../config/permissions";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { PermissionLink } from "@/components/PermissionLink";
import { EditActionButton } from "@/components/EditActionButton";
import { numberSorter, stringSorter } from "@/utils/sorters";
import { Tag } from "antd";

export const getColumns = (
  onDelete: (record: Division) => void,
  onEdit: (record: Division) => void,
  access: ReturnType<typeof useAccess>,
): ProColumns<Division>[] => {
  const canDelete = access[PERMISSIONS.FINANCE.DIVISION.DELETE];
  const canEdit = access[PERMISSIONS.FINANCE.DIVISION.UPDATE];

  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      search: false,
      valueType: "digit",
      sorter: numberSorter<Division>("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      valueType: "text",
      sorter: stringSorter<Division>("name"),
    },
    {
      title: "Administrative+",
      tooltip: "Groups in this division collect administrative expenses",
      dataIndex: "is_administrative",
      key: "is_administrative",
      search: false,
      render: (_, row) =>
        row.is_administrative ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>,
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_id",
      search: false,
      valueType: "text",
    },
    {
      title: "Groups Nr:",
      dataIndex: "group_count",
      key: "group_count",
      search: false,
      valueType: "digit",
      sorter: numberSorter<Division>("group_count"),
      render: (_, record) => (
        <PermissionLink
          canAccess={access[PERMISSIONS.FINANCE.GROUP.READ]}
          to={`/finance/groups?division_ids=${record.id}`}
        >
          {record.group_count}
        </PermissionLink>
      ),
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
        canEdit && (
          <EditActionButton
            key="edit-button"
            itemLabel={record.name}
            onClick={() => onEdit(record)}
          />
        ),
        canDelete && (
          <DeleteActionButton
            key="delete-button"
            entityName="division"
            itemLabel={record.name}
            onConfirm={() => onDelete(record)}
          />
        ),
      ],
    },
  ];
};
