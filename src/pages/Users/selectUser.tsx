import { Button, Select, message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";

import { usersLookup, addUserRole } from "@/services/users";

type Option = { label: string; value: number };

type Props = {
  roleId: number;
  assignedIds: number[];
  onAssigned: () => void;
};

export default function AssignUserSelect({
  roleId,
  assignedIds,
  onAssigned,
}: Props) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Option[]>([]);
  const requestId = useRef(0);

  const search = async (text?: string) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const users = await usersLookup(text || undefined);
      if (id !== requestId.current) return; // ignore outdated responses
      setOptions(
        users
          .filter((u) => !assignedIds.includes(u.id))
          .map((u) => ({ label: u.username, value: u.id })),
      );
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce(search, 400), [assignedIds]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleAssign = async () => {
    await Promise.all(selected.map((s) => addUserRole(s.value, roleId)));
    message.success("Users assigned");
    setSelected([]);
    onAssigned();
  };

  return (
    <>
      <Select
        mode="multiple"
        showSearch
        labelInValue
        filterOption={false}
        style={{ width: 400 }}
        placeholder="Search users"
        value={selected}
        options={options}
        loading={loading}
        onSearch={debouncedSearch}
        onOpenChange={(open) => open && search()}
        onChange={setSelected}
        notFoundContent={loading ? "Loading..." : "No users found"}
      />
      <Button type="primary" disabled={!selected.length} onClick={handleAssign}>
        Assign
      </Button>
    </>
  );
}
