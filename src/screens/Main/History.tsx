import React, { useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, RefreshControl, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTrips } from '../../hooks/useTrips';
import { TripCard } from '../../components/TripCard';
import { Search } from 'lucide-react-native';
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
  const {
    filteredTrips,
    loading,
    refreshing,
    activeFilter,
    searchText,
    setActiveFilter,
    setSearchText,
    fetchTrips,
    refreshTrips,
    deleteTrip
  } = useTrips();

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  const handleDeleteTrip = (id: number, destino: string) => {
    Alert.alert(
      'Excluir Viagem',
      `Deseja realmente excluir a viagem para ${destino}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(id);
              Alert.alert('Sucesso', 'Viagem excluída com sucesso.');
            } catch (error) {
              console.error('Erro ao excluir viagem:', error);
              Alert.alert('Erro', 'Não foi possível excluir a viagem.');
            }
          }
        }
      ]
    );
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
          onChangeText={setSearchText}
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
              onPress={() => setActiveFilter(f)}
            >
              <FilterText active={activeFilter === f}>
                {f.replace('_', ' ')}
              </FilterText>
            </FilterChip>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator color="#FB8500" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item, index) => String(item.idViagem || item.id || index)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshTrips} tintColor="#FB8500" />
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
                onLongPress={() => handleDeleteTrip(item.idViagem || item.id, item.destino)}
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
