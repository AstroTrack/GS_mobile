import { useState, useCallback } from 'react';
import { driverService } from '../services/driverService';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user, updateUserId } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await driverService.getProfile(user.id);
      setProfile(data);
      return data;
    } catch (error: any) {
      console.error('[useProfile] Falha ao carregar perfil:', error);
      if (error.response?.status === 404) {
        setProfile(user);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (id: number, data: any) => {
    setLoading(true);
    try {
      // Se o ID foi alterado manualmente, atualiza no estado global primeiro. (Rafa)
      if (id !== user?.id) {
        await updateUserId(id);
      }

      const payload = {
        ...data,
        idMotorista: id,
        cpf: String(data.cpf),
        cnh: String(data.cnh)
      };

      const response = await driverService.updateProfile(id, payload);
      await fetchProfile();
      return response;
    } catch (error) {
      console.error('[useProfile] Falha ao atualizar perfil:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, updateUserId, fetchProfile]);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
  };
};
