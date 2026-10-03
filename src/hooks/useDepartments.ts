import { useCallback, useEffect, useState } from "react";
import type { Department } from "../types/finance";
import { financeService } from "../services/financeService";

// TODO: Start to use the hooks
export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await financeService.getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load departments",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  return {
    departments,
    loading,
    error,
    reload: loadDepartments,
  };
}
