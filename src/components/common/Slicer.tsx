import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, FilterX, Search, Check } from "lucide-react";
import "./Slicer.css";

export type SlicerOption = {
  id: string | number;
  label: string;
  subLabel?: string;
  badge?: string | number;
};

export type SlicerProps = {
  title: string;
  options: SlicerOption[];
  selectedValues: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  multiSelect?: boolean;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  requireApply?: boolean;
};

export function Slicer({
  title,
  options,
  selectedValues,
  onChange,
  multiSelect = true,
  placeholder = "All",
  disabled = false,
  searchPlaceholder = "Search options...",
  requireApply = false,
}: SlicerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingValues, setPendingValues] =
    useState<(string | number)[]>(selectedValues);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Stage a local copy of the selection each time the dropdown opens,
  // so requireApply mode can discard uncommitted changes on close.
  useEffect(() => {
    if (isOpen) setPendingValues(selectedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(q)),
    );
  }, [options, searchQuery]);

  const hasSelection = selectedValues.length > 0;

  const toggleValue = (current: (string | number)[], id: string | number) => {
    if (multiSelect) {
      return current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
    }
    return current.includes(id) ? [] : [id];
  };

  const handleToggle = (id: string | number) => {
    if (requireApply) {
      setPendingValues((current) => toggleValue(current, id));
      return;
    }
    onChange(toggleValue(selectedValues, id));
    if (!multiSelect) setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleSelectAll = () => {
    const all = options.map((opt) => opt.id);
    if (requireApply) setPendingValues(all);
    else onChange(all);
  };

  const handleClearClick = () => {
    if (requireApply) setPendingValues([]);
    else onChange([]);
  };

  const handleApply = () => {
    onChange(pendingValues);
    setIsOpen(false);
  };

  const selectedLabels = useMemo(() => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const match = options.find((o) => o.id === selectedValues[0]);
      return match ? match.label : `${selectedValues.length} selected`;
    }
    return `${selectedValues.length} selected`;
  }, [selectedValues, options, placeholder]);

  // What the dropdown shows as checked: staged values in requireApply mode.
  const displayedValues = requireApply ? pendingValues : selectedValues;

  return (
    <div
      className={`slicer-container ${isOpen ? "open" : ""}`}
      ref={containerRef}
    >
      <div className="slicer-trigger-wrapper">
        <button
          type="button"
          className={`slicer-trigger ${hasSelection ? "active" : ""}`}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
        >
          <span className="slicer-title-tag">{title}:</span>
          <span className="slicer-value-label">{selectedLabels}</span>
          {hasSelection && (
            <span
              className="slicer-clear-btn"
              onClick={handleClear}
              title={`Clear ${title} filter`}
            >
              <FilterX size={13} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`slicer-chevron ${isOpen ? "rotated" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="slicer-dropdown">
          <div className="slicer-search-bar">
            <Search size={13} />
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="slicer-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          {multiSelect && options.length > 1 && (
            <div className="slicer-quick-actions">
              <button
                type="button"
                className="slicer-action-link"
                onClick={handleSelectAll}
                disabled={displayedValues.length === options.length}
              >
                Select all
              </button>
              <button
                type="button"
                className="slicer-action-link"
                onClick={handleClearClick}
                disabled={displayedValues.length === 0}
              >
                Clear
              </button>
            </div>
          )}

          <div className="slicer-options-list">
            {filteredOptions.map((option) => {
              const isSelected = displayedValues.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={`slicer-option-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleToggle(option.id)}
                >
                  <div
                    className={`slicer-checkbox ${multiSelect ? "multi" : "single"} ${
                      isSelected ? "checked" : ""
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                  <div className="slicer-option-text">
                    <span className="slicer-option-label">{option.label}</span>
                    {option.subLabel && (
                      <span className="slicer-option-sublabel">
                        {option.subLabel}
                      </span>
                    )}
                  </div>
                  {option.badge !== undefined && (
                    <span className="slicer-option-badge">{option.badge}</span>
                  )}
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="slicer-empty">No options found</div>
            )}
          </div>

          {requireApply && (
            <div className="slicer-apply-footer">
              <button
                type="button"
                className="slicer-action-link"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button compact-button"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
