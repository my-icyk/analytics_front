// CopyTargetsFromRule.tsx
import { useState } from "react";
import { Button, Popconfirm, Select, Space } from "antd";

type RuleOption = { id: number; name: string };

type Props = {
  rules: RuleOption[]; // all rules, passed from the page
  currentRuleId: number;
  currentTargetsCount?: number; // used in the confirm text
  onCopy: (sourceRuleId: number) => Promise<void>;
};

export function CopyTargetsFromRule({
  rules,
  currentRuleId,
  currentTargetsCount = 0,
  onCopy,
}: Props) {
  const [sourceId, setSourceId] = useState<number>();
  const [loading, setLoading] = useState(false);

  const options = rules
    .filter((r) => r.id !== currentRuleId) // can't copy from itself
    .map((r) => ({ value: r.id, label: r.name }));

  const handleConfirm = async () => {
    if (!sourceId) return;
    setLoading(true);
    try {
      await onCopy(sourceId);
      setSourceId(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Select
        showSearch
        allowClear
        placeholder="Copy targets from another rule"
        style={{ width: "100%" }}
        options={options}
        value={sourceId}
        onChange={setSourceId}
        optionFilterProp="label"
      />
      <Popconfirm
        title="Replace all targets?"
        description={`This will replace ${currentTargetsCount} current target(s) with the targets of the selected rule.`}
        okText="Replace"
        okButtonProps={{ danger: true }}
        onConfirm={handleConfirm}
        disabled={!sourceId}
      >
        <Button type="primary" disabled={!sourceId} loading={loading}>
          Copy
        </Button>
      </Popconfirm>
    </Space.Compact>
  );
}
