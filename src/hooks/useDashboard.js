import { useState, useCallback } from 'react';
import { dashboardApi } from '../services/api';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuperAdminDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getSuperAdminStats();
      setStats(response.data.stats);
      setRecentCompanies(response.data.recent_companies || []);
      setRecentActivity(response.data.recent_activity || []);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientAdminDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getClientAdminStats();
      setStats(response.data.stats);
      setRecentDocuments(response.data.recent_documents || []);
      setRecentActivity(response.data.recent_activity || []);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    recentCompanies,
    recentActivity,
    recentDocuments,
    loading,
    error,
    fetchSuperAdminDashboard,
    fetchClientAdminDashboard,
  };
}

export default useDashboard;
