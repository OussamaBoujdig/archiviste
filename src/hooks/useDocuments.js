import { useState, useEffect, useCallback } from 'react';
import { documentsApi } from '../services/api';

export function useDocuments(initialParams = {}) {
  const [documents, setDocuments] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchDocuments = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await documentsApi.getAll({ ...params, ...newParams });
      setDocuments(response.data);
      if (response.meta) setMeta(response.meta);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const createDocument = async (formData) => {
    const response = await documentsApi.create(formData);
    await fetchDocuments();
    return response;
  };

  const updateDocument = async (id, data) => {
    const response = await documentsApi.update(id, data);
    await fetchDocuments();
    return response;
  };

  const deleteDocument = async (id) => {
    await documentsApi.delete(id);
    await fetchDocuments();
  };

  const archiveDocument = async (id) => {
    await documentsApi.archive(id);
    await fetchDocuments();
  };

  return {
    documents,
    meta,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    archiveDocument,
    setParams,
  };
}

export default useDocuments;
