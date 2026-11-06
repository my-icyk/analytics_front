import { ProColumns } from "@ant-design/pro-components";
import type { Division } from "@/types/divisions";
import { PERMISSIONS } from "../../../../config/permissions";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { PermissionLink } from "@/components/PermissionLink";
import { EditActionButton } from "@/components/EditActionButton";
import { numberSorter, stringSorter } from "@/utils/sorters";
import { Tag } from "antd";
import { Can } from "@/access";

export const getColumns = (
  onDelete: (record: Division) => void,
  onEdit: (record: Division) => void,
  can: Can,
): ProColumns<Division>[] => {
  const canEdit = can(PERMISSIONS.FINANCE.DIVISION.UPDATE);
  const canDelete = can(PERMISSIONS.FINANCE.DIVISION.DELETE);
  const canAccess = can(PERMISSIONS.FINANCE.GROUP.READ);
  const hideActions = !(canEdit || canDelete);

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
          canAccess={canAccess}
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
      hideInTable: hideActions,
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
