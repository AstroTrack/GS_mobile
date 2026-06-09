import { useState, useCallback, useMemo } from 'react';
import { tripService } from '../services/tripService';

export const useTrips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [searchText, setSearchText] = useState('');

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tripService.listRecent();
      setTrips(data || []);
    } catch (error) {
      console.error('[useTrips] Failed to fetch trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refreshTrips = useCallback(async () => {
    setRefreshing(true);
    await fetchTrips();
  }, [fetchTrips]);

  const filteredTrips = useMemo(() => {
    let result = trips;
    
    if (activeFilter !== 'TODOS') {
      result = result.filter(t => t.status === activeFilter);
    }

    if (searchText) {
      const search = searchText.toLowerCase();
      result = result.filter(t => 
        (t.destino && t.destino.toLowerCase().includes(search)) || 
        (t.origem && t.origem.toLowerCase().includes(search))
      );
    }

    return result;
  }, [trips, activeFilter, searchText]);

  const activeTrip = useMemo(() => 
    trips.find(t => t.status === 'EM_ANDAMENTO'), 
  [trips]);

  const stats = useMemo(() => ({
    finishedCount: trips.filter(t => t.status === 'FINALIZADA').length,
    plannedCount: trips.filter(t => t.status === 'PLANEJADA' || t.status === 'AGENDADA').length,
  }), [trips]);

  const createTrip = async (data: any) => {
    const response = await tripService.createTrip(data);
    await fetchTrips();
    return response;
  };

  const deleteTrip = async (id: number) => {
    await tripService.deleteTrip(id);
    await fetchTrips();
  };

  const updateTrip = async (id: number, data: any) => {
    const response = await tripService.updateTrip(id, data);
    await fetchTrips();
    return response;
  };

  const checkIn = async (data: any) => {
    return await tripService.checkIn(data);
  };

  const finishTrip = async (id: number, tripData: any) => {
    const response = await tripService.finishTrip(id, tripData);
    await fetchTrips();
    return response;
  };

  const getTripById = async (id: number) => {
    return await tripService.getById(id);
  };

  return {
    trips,
    filteredTrips,
    loading,
    refreshing,
    activeFilter,
    searchText,
    activeTrip,
    stats,
    setActiveFilter,
    setSearchText,
    fetchTrips,
    refreshTrips,
    createTrip,
    deleteTrip,
    updateTrip,
    checkIn,
    finishTrip,
    getTripById,
  };
};
