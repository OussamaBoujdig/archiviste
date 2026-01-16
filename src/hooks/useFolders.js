import { useState, useEffect, useCallback } from 'react';
import { foldersApi } from '../services/api';

export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await foldersApi.getAll(params);
      setFolders(response.data);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await foldersApi.getTree();
      setTree(response.data);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, []);

  const createFolder = async (data) => {
    const response = await foldersApi.create(data);
    await fetchFolders();
    return response;
  };

  const updateFolder = async (id, data) => {
    const response = await foldersApi.update(id, data);
    await fetchFolders();
    return response;
  };

  const deleteFolder = async (id) => {
    await foldersApi.delete(id);
    await fetchFolders();
  };

  return {
    folders,
    tree,
    loading,
    error,
    fetchFolders,
    fetchTree,
    createFolder,
    updateFolder,
    deleteFolder,
  };
}

export default useFolders;
