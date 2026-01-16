import { useState, useEffect, useCallback } from 'react';
import { activityLogsApi } from '../services/api';

export function useActivityLogs(initialParams = {}) {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityLogsApi.getAll({ ...initialParams, ...params });
      setLogs(response.data);
      if (response.meta) setMeta(response.meta);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await activityLogsApi.getStats();
      setStats(response.data);
      return response;
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    meta,
    stats,
    loading,
    error,
    fetchLogs,
    fetchStats,
  };
}

export default useActivityLogs;
