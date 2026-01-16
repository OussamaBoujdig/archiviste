import { useState, useEffect, useCallback } from 'react';
import { companiesApi } from '../services/api';

export function useCompanies(initialParams = {}) {
  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await companiesApi.getAll({ ...initialParams, ...params });
      setCompanies(response.data);
      if (response.meta) setMeta(response.meta);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const createCompany = async (data) => {
    const response = await companiesApi.create(data);
    await fetchCompanies();
    return response;
  };

  const updateCompany = async (id, data) => {
    const response = await companiesApi.update(id, data);
    await fetchCompanies();
    return response;
  };

  const deleteCompany = async (id) => {
    await companiesApi.delete(id);
    await fetchCompanies();
  };

  const suspendCompany = async (id) => {
    await companiesApi.suspend(id);
    await fetchCompanies();
  };

  const activateCompany = async (id) => {
    await companiesApi.activate(id);
    await fetchCompanies();
  };

  return {
    companies,
    meta,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    suspendCompany,
    activateCompany,
  };
}

export default useCompanies;
