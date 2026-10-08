import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
import { useGroupLookup } from "..";
import type { Group } from "../groups.types";

type GroupSearchSelectProps = {
  /** Currently displayed group — shown as the placeholder so the box reflects context. */
  current: Group;
  onSelect: (groupId: number) => void;
};

/**
 * Async group picker backed by /finance/groups/lookup. Loads the top-20
 * (no filter) as soon as it opens, then narrows with a debounced search.
 */
export function GroupSearchSelect({
  current,
  onSelect,
}: GroupSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const debounced = useDebouncedValue(input);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isFetching } = useGroupLookup(debounced);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const showResults = open;

  return (
    <div className="group-search" ref={containerRef}>
      <div className="search-box">
        <Search size={14} />
        <input
          type="text"
          placeholder={`Switch from: ${current.name}`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {showResults && (
        <div className="group-search-dropdown">
          {isFetching && <div className="group-search-hint">Loading…</div>}
          {!isFetching && results.length === 0 && (
            <div className="group-search-hint">No groups match.</div>
          )}
          {!isFetching &&
            results.map((g) => (
              <button
                key={g.id}
                type="button"
                className="group-search-option"
                onClick={() => {
                  onSelect(g.id);
                  setInput("");
                  setOpen(false);
                }}
              >
                <strong>{g.description}</strong>
                <small>#{g.id}</small>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
