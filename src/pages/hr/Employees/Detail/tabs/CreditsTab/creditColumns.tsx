import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { Credit } from "@/types/hr";
import { CreditActionType } from "../../ActionModals";

const statusColorMap: Record<Credit["status"], string> = {
  active: "blue",
  completed: "green",
  paid_off: "green",
  cancelled: "red",
};

type Options = {
  onEdit: (credit: Credit) => void;
  onAction: (type: CreditActionType, credit: Credit) => void;
};

export const getCreditColumns = ({
  onEdit,
  onAction,
}: Options): ProColumns<Credit>[] => [
  {
    title: "ID",
    dataIndex: "id",
    search: false,
  },
  {
    title: "Credit Amount",
    dataIndex: "credit_amount",
    search: false,
  },
  {
    title: "Months",
    dataIndex: "nr_months",
    search: false,
    sorter: true,
  },
  {
    title: "Start Month",
    dataIndex: "start_month",
    search: false,
    sorter: true,
  },
  {
    title: "Paid Off",
    dataIndex: "paid_off_on",
    search: false,
  },
  {
    title: "Comments",
    dataIndex: "comments",
    search: false,
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    valueType: "select",
    valueEnum: {
      active: { text: "active" },
      completed: { text: "completed" },
      paid_off: { text: "paid_off" },
      cancelled: { text: "cancelled" },
    },
    render: (_, record) => (
      <Tag color={statusColorMap[record.status]}>{record.status}</Tag>
    ),
  },
  {
    title: "Actions",
    valueType: "option",
    width: 150,
    render: (_, credit) => {
      const isActive = credit.status === "active";

      return (
        <Space size="small">
          {isActive && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(credit)}
              title="Edit"
            />
          )}
          {isActive && (
            <Button
              type="text"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => onAction("payoff", credit)}
              title="Pay Off"
            />
          )}
          {isActive && (
            <Button
              type="text"
              size="small"
              icon={<StopOutlined />}
              onClick={() => onAction("cancel", credit)}
              title="Cancel"
            />
          )}
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onAction("delete", credit)}
            title="Delete"
          />
        </Space>
      );
    },
  },
];
