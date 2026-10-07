import { useEffect, useState } from "react";
import { DEFAULT_DEBOUNCE_DELAY } from "../constants/config";

export function useDebouncedValue<T>(
  value: T,
  delay = DEFAULT_DEBOUNCE_DELAY,
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
