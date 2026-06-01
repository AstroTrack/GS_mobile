import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/useAuth';
import { tripService } from '../../services/tripService';
import { TripCard } from '../../components/TripCard';
import { LogOut, User, Plus, Satellite } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MotiView, MotiText } from 'moti';

import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const ActiveTripContainer = styled.View`
  background-color: #FB850020;
  margin: 24px;
  padding: 16px;
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: #FB8500;
`;

const ActiveTripTitle = styled.Text`
  color: #FB8500;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Header = styled.View`
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const WelcomeText = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 20px;
  font-weight: bold;
  margin-left: 12px;
`;

const ListHeader = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 18px;
  font-weight: bold;
  margin-horizontal: 24px;
  margin-bottom: 16px;
`;

const LogoutButton = styled.TouchableOpacity`
  padding: 8px;
`;

const FAB = styled.TouchableOpacity`
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.COLORS.ACCENT};
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const SummaryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 24px;
`;

const SummaryBox = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  flex: 0.48;
  padding: 20px;
  border-radius: 16px;
  align-items: center;
`;

const SummaryValue = styled.Text`
  color: ${({ theme }) => theme.COLORS.ACCENT};
  font-size: 24px;
  font-weight: bold;
`;

const SummaryLabel = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 12px;
  margin-top: 4px;
  text-transform: uppercase;
`;

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = async () => {
    try {
      const data = await tripService.listRecent();
      setTrips(data || []);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  const activeTrip = trips.find(t => t.status === 'EM_ANDAMENTO');
  const finishedCount = trips.filter(t => t.status === 'FINALIZADA').length;
  const plannedCount = trips.filter(t => t.status === 'PLANEJADA' || t.status === 'AGENDADA').length;

  return (
    <Container>
      <Header>
        <UserInfo>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FB8500', justifyContent: 'center', alignItems: 'center' }}>
            <User color="#FFF" size={24} />
          </View>
          <MotiView
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <WelcomeText>Olá, {user?.nome?.split(' ')[0] || 'Motorista'}</WelcomeText>
          </MotiView>
        </UserInfo>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MotiView
            animate={{ 
              rotate: refreshing ? '360deg' : '0deg' 
            }}
            transition={{ loop: refreshing, duration: 1000, type: 'timing' }}
          >
            <TouchableOpacity onPress={onRefresh} style={{ padding: 8 }}>
              <Satellite color="#FB8500" size={20} />
            </TouchableOpacity>
          </MotiView>
        </View>
      </Header>

      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FB8500" />
        }
      >
        <SummaryContainer>
          <SummaryBox>
            <SummaryValue>{finishedCount}</SummaryValue>
            <SummaryLabel>Concluídas</SummaryLabel>
          </SummaryBox>
          <SummaryBox>
            <SummaryValue>{plannedCount}</SummaryValue>
            <SummaryLabel>Agendadas</SummaryLabel>
          </SummaryBox>
        </SummaryContainer>

        {activeTrip ? (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ paddingHorizontal: 24 }}
          >
            <ActiveTripTitle>Viagem em Andamento</ActiveTripTitle>
            <TripCard 
              destino={activeTrip.destino}
              data={activeTrip.dataInicio}
              status={activeTrip.status}
              onPress={() => navigation.navigate('CheckIn', { 
                idViagem: activeTrip.idViagem || activeTrip.id, 
                destino: activeTrip.destino 
              })}
            />
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: 24, alignItems: 'center' }}
          >
            <View style={{ backgroundColor: '#FB850010', padding: 32, borderRadius: 24, width: '100%', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#FB8500' }}>
              <Plus color="#FB8500" size={48} />
              <Text style={{ color: '#FB8500', fontWeight: 'bold', marginTop: 16 }}>Nenhuma viagem ativa</Text>
              <TouchableOpacity onPress={() => navigation.navigate('NewTrip')}>
                <Text style={{ color: '#6C757D', marginTop: 8 }}>Toque no + para iniciar</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}

        <View style={{ padding: 24 }}>
          <ActiveTripTitle>Visão Geral do Sistema</ActiveTripTitle>
          <View style={{ backgroundColor: '#1C2541', padding: 20, borderRadius: 16 }}>
            <Text style={{ color: '#FFF', marginBottom: 8 }}>• Conexão Satelital: Estável</Text>
            <Text style={{ color: '#FFF', marginBottom: 8 }}>• Sincronização Oracle: Online</Text>
            <Text style={{ color: '#FFF' }}>• Protocolo IoT: Ativo (ESP32)</Text>
          </View>
        </View>
      </ScrollView>

      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 500 }}
      >
        <FAB onPress={() => navigation.navigate('NewTrip')}>
          <Plus color="#FFF" size={32} />
        </FAB>
      </MotiView>
    </Container>
  );
};
