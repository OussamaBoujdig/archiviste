import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/api';

export function useUsers(initialParams = {}) {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAll({ ...initialParams, ...params });
      setUsers(response.data);
      if (response.meta) setMeta(response.meta);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (data) => {
    const response = await usersApi.create(data);
    await fetchUsers();
    return response;
  };

  const updateUser = async (id, data) => {
    const response = await usersApi.update(id, data);
    await fetchUsers();
    return response;
  };

  const deleteUser = async (id) => {
    await usersApi.delete(id);
    await fetchUsers();
  };

  const resetPassword = async (id, password) => {
    await usersApi.resetPassword(id, password);
  };

  return {
    users,
    meta,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
  };
}

export default useUsers;
