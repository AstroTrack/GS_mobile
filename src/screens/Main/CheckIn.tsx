import React, { useState, useEffect } from 'react';
import { Alert, View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { tripService } from '../../services/tripService';
import { ShieldAlert, ArrowLeft, MapPin, CheckCircle, Trash2, Edit3 } from 'lucide-react-native';
import { MotiView } from 'moti';

import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const Header = styled.View`
  padding: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 20px;
  font-weight: bold;
  margin-left: 16px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const TripInfo = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 18px;
  font-weight: bold;
`;

const DestinoText = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 16px;
`;

const PanicButton = styled.TouchableOpacity`
  background-color: #E5393520;
  border-width: 1px;
  border-color: #E53935;
  border-radius: 8px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

const PanicText = styled.Text`
  color: #E53935;
  font-weight: bold;
  margin-left: 8px;
`;

const LocationStatus = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  background-color: #4CAF5020;
  padding: 12px;
  border-radius: 8px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

const SecondaryButton = styled.TouchableOpacity<{ color?: string }>`
  flex: 0.48;
  height: 56px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ color, theme }) => color || theme.COLORS.TEXT_SECONDARY};
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 24px;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  width: 100%;
  padding: 24px;
  border-radius: 16px;
`;

export const CheckIn = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { idViagem, destino: initialDestino } = route.params as { idViagem: number, destino: string };

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destino, setDestino] = useState(initialDestino);
  const [trip, setTrip] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newDestino, setNewDestino] = useState(initialDestino);

  useEffect(() => {
    async function fetchTripDetails() {
      try {
        const data = await tripService.getById(idViagem);
        setTrip(data);
        if (data.destino) setDestino(data.destino);
      } catch (error) {
        console.error('Erro ao buscar detalhes da viagem:', error);
      }
    }
    fetchTripDetails();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleCheckIn = async (panic = false) => {
    if (!location && !panic) {
      return Alert.alert('Localização', 'Aguardando obter sua localização atual...');
    }

    setLoading(true);
    try {
      const coords = location?.coords || { latitude: 0, longitude: 0 };
      
      await tripService.checkIn({
        idViagem,
        latitude: coords.latitude,
        longitude: coords.longitude,
        dataRegistro: new Date().toISOString().split('.')[0],
        botaoPanico: panic,
        portaAberta: false
      });

      Alert.alert(
        panic ? 'ALERTA ENVIADO' : 'Sucesso',
        panic ? 'O centro de controle foi notificado.' : 'Check-in realizado com sucesso!',
        [{ text: 'OK', onPress: () => !panic && navigation.goBack() }]
      );
    } catch (error: any) {
      const message = error.response?.data?.mensagem || 'Não foi possível realizar o check-in.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishTrip = async () => {
    if (!trip) {
      return Alert.alert('Aguarde', 'Sincronizando dados da viagem com o satélite...');
    }

    Alert.alert(
      'Finalizar Viagem',
      'Deseja realmente finalizar esta viagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          onPress: async () => {
            setLoading(true);
            try {
              await tripService.finishTrip(idViagem, trip);
              Alert.alert('Sucesso', 'Viagem finalizada com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
              ]);
            } catch (error: any) {
              const message = error.response?.data?.mensagem || 'Falha ao finalizar viagem.';
              Alert.alert('Erro', message);
            } finally {
              setLoading(false);
            }
          } 
        }
      ]
    );
  };

  const handleDeleteTrip = async () => {
    Alert.alert(
      'Excluir Viagem',
      'Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await tripService.deleteTrip(idViagem);
              Alert.alert('Sucesso', 'Viagem excluída.', [
                { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
              ]);
            } catch (error: any) {
              Alert.alert('Erro', 'Falha ao excluir viagem.');
            } finally {
              setLoading(false);
            }
          } 
        }
      ]
    );
  };

  const handleUpdateDestino = async () => {
    if (!newDestino.trim() || !trip) return;
    
    setLoading(true);
    try {
      const updatedTrip = { ...trip, destino: newDestino };
      await tripService.updateTrip(idViagem, updatedTrip);
      setDestino(newDestino);
      setTrip(updatedTrip); // Atualiza o estado local com os novos dados
      setIsEditModalVisible(false);
      Alert.alert('Sucesso', 'Destino atualizado!');
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao atualizar destino.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackButton onPress={() => navigation.goBack()}>
            <ArrowLeft color="#FFF" size={24} />
          </BackButton>
          <HeaderTitle>Gestão da Viagem</HeaderTitle>
        </View>
        <TouchableOpacity onPress={handleDeleteTrip}>
          <Trash2 color="#E53935" size={24} />
        </TouchableOpacity>
      </Header>

      <Content>
        <TripInfo>
          <SectionHeader>
            <SectionTitle>Destino</SectionTitle>
            <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
              <Edit3 color="#FB8500" size={20} />
            </TouchableOpacity>
          </SectionHeader>
          <DestinoText>{destino}</DestinoText>
        </TripInfo>

        {location ? (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <LocationStatus>
              <MapPin color="#4CAF50" size={20} />
              <Text style={{ color: '#4CAF50', marginLeft: 8, fontWeight: 'bold' }}>
                Sinal GPS: Forte
              </Text>
            </LocationStatus>
          </MotiView>
        ) : (
          <View style={{ marginBottom: 24, padding: 12, backgroundColor: '#6C757D20', borderRadius: 8 }}>
            <Text style={{ color: '#6C757D', textAlign: 'center' }}>
              {errorMsg || 'Sincronizando com satélites...'}
            </Text>
          </View>
        )}

        <Button 
          title="REGISTRAR CHECK-IN" 
          onPress={() => handleCheckIn(false)}
          loading={loading}
          disabled={!location}
        />

        <ActionRow>
          <SecondaryButton color="#4CAF50" onPress={handleFinishTrip}>
            <CheckCircle color="#4CAF50" size={20} style={{ marginRight: 8 }} />
            <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>FINALIZAR</Text>
          </SecondaryButton>
          
          <SecondaryButton onPress={() => handleCheckIn(true)}>
            <ShieldAlert color="#E53935" size={20} style={{ marginRight: 8 }} />
            <Text style={{ color: '#E53935', fontWeight: 'bold' }}>PÂNICO</Text>
          </SecondaryButton>
        </ActionRow>

        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: '#6C757D', textAlign: 'center', fontSize: 12 }}>
            ID da Viagem: #{idViagem} | Versão Protocolo Satelital: 2.4.0
          </Text>
        </View>
      </Content>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
      >
        <ModalContainer>
          <ModalContent>
            <SectionTitle style={{ marginBottom: 16 }}>Editar Destino</SectionTitle>
            <Input
              icon={MapPin}
              value={newDestino}
              onChangeText={setNewDestino}
              placeholder="Novo destino"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24 }}>
              <TouchableOpacity 
                onPress={() => setIsEditModalVisible(false)}
                style={{ marginRight: 24 }}
              >
                <Text style={{ color: '#6C757D', fontWeight: 'bold' }}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateDestino}>
                <Text style={{ color: '#FB8500', fontWeight: 'bold' }}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};
