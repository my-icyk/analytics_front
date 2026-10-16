import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, message } from "antd";

import { getColumns } from "./columns";
import type {
  Repartition,
  RepartitionCreate,
  RepartitionUpdate,
} from "@/types/departments";
import { getRepartitions } from "@/services/groups";
import { createRepartition, updateRepartition } from "@/services/repartition";
import {
  RepartitionModal,
  type RepartitionInitialValues,
} from "./RepartitionModal";

type DepartmentTabProps = {
  groupId: number;
};

type ModalState =
  { open: false } | { open: true; record?: RepartitionInitialValues };

export default function DepartmentTab({ groupId }: DepartmentTabProps) {
  const [repartitions, setRepartitions] = useState<Repartition[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<Repartition>>({});
  const [modal, setModal] = useState<ModalState>({ open: false });

  // Guards against out-of-order responses and updates after unmount.
  const requestIdRef = useRef(0);

  const loadRepartitions = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const data = await getRepartitions(groupId);
      if (requestId === requestIdRef.current) {
        setRepartitions(data);
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        message.error("Failed to load repartitions");
      }
      console.error("Failed to load repartitions:", error);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [groupId]);

  useEffect(() => {
    void loadRepartitions();

    return () => {
      requestIdRef.current += 1; // invalidate any in-flight request
    };
  }, [loadRepartitions]);

  const filteredRepartitions = useMemo(() => {
    return repartitions.filter((repartition) =>
      Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }

        const repartitionValue = repartition[key as keyof Repartition];

        return String(repartitionValue ?? "")
          .toLowerCase()
          .includes(String(value).toLowerCase());
      }),
    );
  }, [repartitions, filters]);

  const closeModal = useCallback(() => setModal({ open: false }), []);

  const openCreate = useCallback(() => setModal({ open: true }), []);

  const openEdit = useCallback(
    (record: Repartition) =>
      // Rows are fetched per group, so every row belongs to this tab's group.
      setModal({ open: true, record: { ...record } }),
    [groupId],
  );

  const handleSubmit = async (
    payload: RepartitionCreate | RepartitionUpdate,
  ) => {
    try {
      if ("id" in payload) {
        // URL targets the group the record currently belongs to (this tab's group);
        // the body carries the possibly changed group_id.
        await updateRepartition(groupId, payload.id, payload);
      } else {
        await createRepartition(groupId, payload);
      }

      message.success("Saved");
      closeModal();
      await loadRepartitions();
    } catch (error) {
      console.error("Failed to save repartition:", error);
      message.error("Could not save the repartition");
      throw error; // keeps the modal open
    }
  };

  const columns = useMemo(() => getColumns({ onEdit: openEdit }), [openEdit]);

  return (
    <>
      <ProTable<Repartition>
        rowKey="id"
        columns={columns}
        dataSource={filteredRepartitions}
        loading={loading}
        search={{
          labelWidth: "auto",
          searchText: "Filter",
          resetText: "Reset",
        }}
        onSubmit={(params) => setFilters(params)}
        onReset={() => setFilters({})}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
          >
            New repartition
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <RepartitionModal
        open={modal.open}
        initialValues={modal.open ? modal.record : undefined}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
