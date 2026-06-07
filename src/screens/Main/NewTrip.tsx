import React, { useState } from 'react';
import { Alert, View, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Calendar, Navigation, Truck, User as UserIcon, Building, Hash } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { tripService } from '../../services/tripService';
import { useAuth } from '../../hooks/useAuth';

import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const Header = styled.View`
  padding: 24px;
  flex-direction: row;
  align-items: center;
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

const Form = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-left: 4px;
`;

export const NewTrip = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [idVeiculo, setIdVeiculo] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [kmTotal, setKmTotal] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleCreateTrip = async () => {
    if (!origem.trim() || !destino.trim() || !idVeiculo || !idCliente || !kmTotal) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    }

    setLoading(true);
    try {
      // Formata para LocalDateTime esperado pelo Spring
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss
      const formattedDataInicio = `${dataInicio}T${timeStr}`;

      if (!user?.id) throw new Error("Usuário não identificado");

      await tripService.createTrip({
        origem,
        destino,
        dataInicio: formattedDataInicio,
        status: 'EM_ANDAMENTO',
        idMotorista: user.id,
        idVeiculo: Number(idVeiculo),
        idCliente: Number(idCliente),
        quilometragemTotal: Number(kmTotal)
      });

      Alert.alert('Sucesso', 'Nova viagem iniciada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Dashboard' }) }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.mensagem || 'Falha ao criar viagem.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <ArrowLeft color="#FFF" size={24} />
        </BackButton>
        <HeaderTitle>Nova Viagem</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Form>
          <Label>PONTO DE ORIGEM</Label>
          <Input
            icon={Navigation}
            placeholder="Ex: Sorriso - MT"
            value={origem}
            onChangeText={setOrigem}
          />

          <View style={{ height: 16 }} />

          <Label>DESTINO FINAL</Label>
          <Input
            icon={MapPin}
            placeholder="Ex: Porto de Santos - SP"
            value={destino}
            onChangeText={setDestino}
          />

          <View style={{ height: 16 }} />

          <Label>DATA DE INÍCIO</Label>
          <Input
            icon={Calendar}
            placeholder="AAAA-MM-DD"
            value={dataInicio}
            onChangeText={setDataInicio}
          />

          <View style={{ height: 16 }} />

          <Label>ID DO VEÍCULO</Label>
          <Input
            icon={Truck}
            placeholder="Ex: 1"
            keyboardType="numeric"
            value={idVeiculo}
            onChangeText={(v) => setIdVeiculo(v.replace(/\D/g, ''))}
          />

          <View style={{ height: 16 }} />

          <Label>ID DO CLIENTE</Label>
          <Input
            icon={Building}
            placeholder="Ex: 1"
            keyboardType="numeric"
            value={idCliente}
            onChangeText={(v) => setIdCliente(v.replace(/\D/g, ''))}
          />

          <View style={{ height: 16 }} />

          <Label>QUILOMETRAGEM TOTAL ESTIMADA</Label>
          <Input
            icon={Hash}
            placeholder="Ex: 1800"
            keyboardType="numeric"
            value={kmTotal}
            onChangeText={(v) => setKmTotal(v.replace(/\D/g, ''))}
          />
        </Form>

        <Button
          title="INICIAR RASTREAMENTO"
          onPress={handleCreateTrip}
          loading={loading}
          style={{ marginBottom: 40 }}
        />
      </Content>
    </Container>
  );
};

const Text = styled.Text``;
