import { ExternalLink } from "lucide-react";
import { Counter } from "../countersExceptions.types";

type CountersTableProps = {
  counters: Counter[];
  isLoading: boolean;
  error: string;
  onOpen: (counter: Counter) => void;
};

const COLUMN_COUNT = 4;

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

export function CountersTable({
  counters,
  isLoading,
  error,
  onOpen,
}: CountersTableProps) {
  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Counters</h2>
          <p>Counters with exceptions.</p>
        </div>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <table className="table-wrap">
        <thead>
          <tr>
            <th>Counter ID</th>
            <th>Exception Count</th>
            <th>Last Change</th>
            <th>
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={COLUMN_COUNT}>Loading...</td>
            </tr>
          ) : counters.length === 0 ? (
            <tr>
              <td colSpan={COLUMN_COUNT}>No counters available.</td>
            </tr>
          ) : (
            counters.map((counter) => (
              <tr key={counter.id}>
                <td>
                  <button
                    className="link-button"
                    onClick={() => onOpen(counter)}
                  >
                    <strong>{counter.id}</strong>
                  </button>
                </td>
                <td>{counter.exception_count}</td>
                <td>{formatDate(counter.last_change)}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-button icon-action-button"
                      title="Open counter exceptions"
                      aria-label={`Open exceptions for counter ${counter.id}`}
                      onClick={() => onOpen(counter)}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
