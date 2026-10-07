import type { ReactNode } from "react";

export type TabItem<K extends string = string> = {
  key: K;
  label: ReactNode;
  disabled?: boolean;
};

type TabsProps<K extends string> = {
  tabs: readonly TabItem<K>[];
  activeTab: K;
  onTabChange: (key: K) => void;
};

/**
 * Generic underline tab bar. Controlled — the parent decides where the
 * active tab lives (usually a URL search param via useTabParam).
 */
export function Tabs<K extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabsProps<K>) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.key === activeTab}
          disabled={tab.disabled}
          className={`tab-button${tab.key === activeTab ? " active" : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
