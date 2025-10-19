import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../sub-components/sidebar.tsx";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { toast } from "react-toastify";
import { getCsrfToken } from "../sub-components/csrfToken.tsx";
import type { User } from "../types/usersFTypes.tsx";

interface LogsProps {
  user?: User | null;
}

interface Log {
  id: number;
  user_id: number;
  username: string;
  action: string;
  created_at: string;
}

const LogsPage: React.FC<LogsProps> = ({ user }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Debounce state
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce effect (wait 500ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`${apiUrl}/api/database/auth/logs?${params.toString()}`, {
        method: "GET",
        headers: {
          "x-csrf-token": await getCsrfToken(),
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        return toast.error(data.error || "Failed to fetch logs.");
      }

      setLogs(data);
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "error" in err
          ? String((err as { error: unknown }).error)
          : "Something went wrong!"
      );
    } finally {
      setTimeout(() => {
        
        setLoading(false);
      }, 1000);
    }
  }, [limit, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
      <Sidebar user={user} />

      <main className="flex-1 p-8 pt-25 h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Database Logs</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-sm shadow-md">
          <input
            type="text"
            placeholder="Search username or action"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-64"
          />

          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-gray-600">Loading logs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-sm shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-gray-700">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {["ID", "User ID", "Username", "Action", "Timestamp"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition"}
                  >
                    <td className="px-6 py-4">{log.id}</td>
                    <td className="px-6 py-4">{log.user_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{log.username}</td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4">{formatDate(log.created_at)}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default LogsPage;
