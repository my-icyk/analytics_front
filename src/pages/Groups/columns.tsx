import { Group, GroupType } from "@/types/groups";
import type { Division } from "@/types/divisions";
import type { ProColumns } from "@ant-design/pro-components";
import { GroupTabKey } from "@/constants/groups";
import { EditActionButton } from "@/components/EditActionButton";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { Tag } from "antd";
import { numericIdsValueProps } from "@/utils/formProps";
import { ViewActionButton } from "@/components/TableActions/ViewActionButton";
import { useAccess } from "@umijs/max";
import { PERMISSIONS } from "../../../config/permissions";
import { PermissionLink } from "@/components/PermissionLink";
/** Table columns of the Users page, kept apart so index.tsx stays short. */
export const getColumns = (
  access: ReturnType<typeof useAccess>,
  groupTypes: GroupType[],
  divisions: Division[],
  onEdit: (record: Group) => void,
  onDelete: (record: Group) => void,
): ProColumns<Group>[] => {
  const canOpen = access[PERMISSIONS.FINANCE.GROUP.READ];
  const canEdit = access[PERMISSIONS.FINANCE.GROUP.UPDATE];
  const canDelete = access[PERMISSIONS.FINANCE.GROUP.DELETE];

  const canOpenRepartitions =
    access[PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.READ];
  const canOpenRules = access[PERMISSIONS.FINANCE.RULE.READ];

  return [
    {
      title: "ID",
      dataIndex: "id",
      search: false,
      render: (_, group) => (
        <PermissionLink canAccess={canOpen} to={`${group.id}`}>
          {group.id}
        </PermissionLink>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "search",
    },
    {
      title: "Division",
      dataIndex: "division_name",
      key: "division_ids",
      valueType: "select",
      fieldProps: {
        options: divisions,
        fieldNames: { label: "name", value: "id" },
        allowClear: true,
        mode: "multiple",
        placeholder: "Select Divisions",
      },
      formItemProps: numericIdsValueProps,
      render: (_, group) => <Tag color="blue">{group.division_name}</Tag>,
    },
    {
      title: "Group Type",
      dataIndex: "group_type_name",
      key: "group_type_ids",
      valueType: "select",

      fieldProps: {
        options: groupTypes,
        fieldNames: { label: "name", value: "id" },
        allowClear: true,
        mode: "multiple",
        placeholder: "Select Group Types",
      },
      formItemProps: numericIdsValueProps,
      render: (_, group) => <Tag color="green">{group.group_type_name}</Tag>,
    },
    {
      title: "Repartition",
      key: "repartition_count",
      search: false,
      render: (_, group) => (
        <PermissionLink
          canAccess={canOpenRepartitions}
          to={`${group.id}?tab=${GroupTabKey.Departments}`}
        >
          {group.repartitions_count}
        </PermissionLink>
      ),
    },
    {
      title: "Rules",
      key: "rules_count",
      search: false,
      render: (_, group) => (
        <PermissionLink
          canAccess={canOpenRules}
          to={`${group.id}?tab=${GroupTabKey.Rules}`}
        >
          {group.rules_count}
        </PermissionLink>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      search: false,
      width: 140,
      align: "center",

      render: (_, record) => [
        canOpen && (
          <ViewActionButton
            key="view-button"
            to={`${record.id}`}
            itemLabel={record.name}
          />
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
            entityName="group"
            itemLabel={record.name}
            onConfirm={() => onDelete(record)}
          />
        ),
      ],
    },
  ];
};
