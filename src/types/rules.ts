export type Rule = {
  id: number;
  name: string;
  group_name: string;
  valid_from: string;
  valid_to: string;
  percent_value: number;
};

export type RuleCreate = {
  name: string;
  valid_from: string;
  valid_to: string;
  percent_value: number;
};

export type RuleUpdate = {
  name?: string;
  valid_from?: string;
  valid_to?: string;
  percent_value?: number;
};

export type AllocationType = "STATIC" | "DIRECT" | "PROPORTIONAL";

export const ALLOCATION_OPTIONS: { value: AllocationType; label: string }[] = [
  { value: "STATIC", label: "Static" },
  { value: "DIRECT", label: "Direct" },
  { value: "PROPORTIONAL", label: "Proportional" },
];

// Fields the user can edit (what the API accepts)
export type TargetBase = {
  group_id: number; // the target group, not the group that owns the rule
  allocation_type: AllocationType;
  percent_value: number;
};

// What the server returns
export type Target = {
  id: number;
  group_id: number;
  group_name: string;
  allocation_type: AllocationType;
  percent_value: number | null;
};

export type TargetCreate = {
  group_id: number;
  allocation_type: AllocationType;
  percent_value: number | null;
};
export type TargetUpdate = TargetCreate;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Informative only. The back end is the one that enforces the rules. */
export function summarizeAllocation(
  targets: Pick<Target, "allocation_type" | "percent_value">[],
) {
  const sumOf = (type: AllocationType) =>
    round2(
      targets
        .filter((t) => t.allocation_type === type)
        .reduce((total, t) => total + Number(t.percent_value ?? 0), 0),
    );

  const direct = sumOf("DIRECT");
  const fixedStatic = sumOf("STATIC");
  const fixed = round2(direct + fixedStatic);

  return {
    direct,
    static: fixedStatic,
    fixed,
    // what proportional targets share between them
    remaining: round2(Math.max(0, 100 - fixed)),
    proportionalCount: targets.filter(
      (t) => t.allocation_type === "PROPORTIONAL",
    ).length,
  };
}
