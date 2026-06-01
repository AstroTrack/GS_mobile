import React, { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { tripService } from '../../services/tripService';
import { TripCard } from '../../components/TripCard';
import { History as HistoryIcon, Search, Filter } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/Input';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const Header = styled.View`
  padding: 24px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 24px;
  font-weight: bold;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  padding-horizontal: 24px;
  margin-bottom: 16px;
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 20px;
  background-color: ${({ active, theme }) => active ? theme.COLORS.ACCENT : theme.COLORS.SECONDARY};
  margin-right: 8px;
`;

const FilterText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) => active ? '#FFF' : theme.COLORS.TEXT_SECONDARY};
  font-size: 12px;
  font-weight: bold;
`;

export const History = () => {
  const navigation = useNavigation<any>();
  const [trips, setTrips] = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [searchText, setSearchText] = useState('');

  const fetchTrips = async () => {
    try {
      const data = await tripService.listRecent();
      setTrips(data || []);
      applyFilters(data || [], activeFilter, searchText);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const applyFilters = (data: any[], filter: string, search: string) => {
    let result = data;
    
    if (filter !== 'TODOS') {
      result = result.filter(t => t.status === filter);
    }

    if (search) {
      result = result.filter(t => 
        t.destino.toLowerCase().includes(search.toLowerCase()) || 
        t.origem.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTrips(result);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(trips, filter, searchText);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    applyFilters(trips, activeFilter, text);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  return (
    <Container>
      <Header>
        <Title>Histórico de Viagens</Title>
      </Header>

      <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
        <Input 
          placeholder="Buscar por destino ou origem..." 
          icon={Search}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16 }}
        >
          {['TODOS', 'EM_ANDAMENTO', 'FINALIZADA', 'AGENDADA', 'CANCELADA'].map((f) => (
            <FilterChip 
              key={f} 
              active={activeFilter === f} 
              onPress={() => handleFilterChange(f)}
            >
              <FilterText active={activeFilter === f}>
                {f.replace('_', ' ')}
              </FilterText>
            </FilterChip>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color="#FB8500" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item, index) => String(item.idViagem || item.id || index)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FB8500" />
          }
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: index * 50 }}
            >
              <TripCard 
                destino={item.destino}
                data={item.dataInicio}
                status={item.status}
                onPress={() => navigation.navigate('CheckIn', { 
                  idViagem: item.idViagem || item.id, 
                  destino: item.destino 
                })}
              />
            </MotiView>
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <Text style={{ color: '#6C757D', textAlign: 'center', marginTop: 40 }}>
              Nenhuma viagem encontrada para este filtro.
            </Text>
          )}
        />
      )}
    </Container>
  );
};
