import { useRef, type KeyboardEvent, type ReactNode } from "react";

export type TabItem<K extends string = string> = {
  key: K;
  label: ReactNode;
  disabled?: boolean;
};

type TabsProps<K extends string> = {
  tabs: readonly TabItem<K>[];
  activeTab: K;
  onTabChange: (key: K) => void;
  /** Links tabs to their panels (see TabPanel). Must be unique on the page. */
  idPrefix?: string;
};

const tabId = (prefix: string, key: string) => `${prefix}-tab-${key}`;
const panelId = (prefix: string, key: string) => `${prefix}-panel-${key}`;

/**
 * Controlled underline tab bar. The parent owns the active tab
 * (usually via useTabParam, so it lives in the URL).
 */
export function Tabs<K extends string>({
  tabs,
  activeTab,
  onTabChange,
  idPrefix = "tabs",
}: TabsProps<K>) {
  const buttonRefs = useRef(new Map<K, HTMLButtonElement>());

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    if (enabled.length === 0) return;

    const current = enabled.findIndex((t) => t.key === activeTab);
    let next: number;

    switch (e.key) {
      case "ArrowRight":
        next = (current + 1) % enabled.length;
        break;
      case "ArrowLeft":
        next = (current - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = enabled.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextKey = enabled[next].key;
    onTabChange(nextKey);
    buttonRefs.current.get(nextKey)?.focus();
  };

  return (
    <div className="tabs" role="tablist" onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              if (el) buttonRefs.current.set(tab.key, el);
              else buttonRefs.current.delete(tab.key);
            }}
            id={tabId(idPrefix, tab.key)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId(idPrefix, tab.key)}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            className={`tab-button${isActive ? " active" : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

type TabPanelProps = {
  idPrefix?: string;
  tabKey: string;
  children: ReactNode;
};

/** Wrap the content of the active tab so screen readers link it to its tab. */
export function TabPanel({
  idPrefix = "tabs",
  tabKey,
  children,
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={panelId(idPrefix, tabKey)}
      aria-labelledby={tabId(idPrefix, tabKey)}
    >
      {children}
    </div>
  );
}
