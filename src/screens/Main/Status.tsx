import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Satellite, Signal, Cpu, Zap, Globe, RefreshCcw } from 'lucide-react-native';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const Header = styled.View`
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 24px;
  font-weight: bold;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const StatusCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  align-items: center;
  border-width: 1px;
  border-color: #FFFFFF10;
`;

const SignalIndicator = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 40px;
  margin-bottom: 16px;
`;

const SignalBar = styled.View<{ height: number; active: boolean }>`
  width: 8px;
  height: ${({ height }) => height}px;
  background-color: ${({ active, theme }) => active ? theme.COLORS.ACCENT : '#FFFFFF20'};
  margin-horizontal: 2px;
  border-radius: 2px;
`;

const StatusText = styled.Text`
  color: ${({ theme }) => theme.COLORS.ACCENT};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const SubStatusText = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 14px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const InfoBox = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  width: 48%;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const BoxLabel = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 12px;
  margin-top: 8px;
  text-transform: uppercase;
`;

const BoxValue = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 14px;
  font-weight: bold;
  margin-top: 4px;
`;

export const Status = () => {
  const [signalStrength, setSignalStrength] = useState(4);
  const [lastSync, setLastSync] = useState('Agora mesmo');

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength(Math.floor(Math.random() * 2) + 3); // Oscila entre 3 e 4 barras
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Header>
        <Title>Sinal Satelital</Title>
        <RefreshCcw color="#FB8500" size={20} />
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <StatusCard>
            <SignalIndicator>
              {[20, 30, 40, 50, 60].map((h, i) => (
                <SignalBar key={i} height={h} active={i < signalStrength} />
              ))}
            </SignalIndicator>
            <StatusText>CONECTADO</StatusText>
            <SubStatusText>Link: Starlink Orbit-42</SubStatusText>
          </StatusCard>
        </MotiView>

        <Grid>
          <InfoBox>
            <Satellite color="#FB8500" size={24} />
            <BoxLabel>Satélites</BoxLabel>
            <BoxValue>8 Ativos</BoxValue>
          </InfoBox>

          <InfoBox>
            <Cpu color="#FB8500" size={24} />
            <BoxLabel>IoT Status</BoxLabel>
            <BoxValue>ESP32 OK</BoxValue>
          </InfoBox>

          <InfoBox>
            <Globe color="#FB8500" size={24} />
            <BoxLabel>Latência</BoxLabel>
            <BoxValue>124ms</BoxValue>
          </InfoBox>

          <InfoBox>
            <Zap color="#FB8500" size={24} />
            <BoxLabel>Bateria IoT</BoxLabel>
            <BoxValue>94%</BoxValue>
          </InfoBox>
        </Grid>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          style={{ 
            backgroundColor: '#FB850010', 
            padding: 20, 
            borderRadius: 12, 
            marginTop: 8,
            borderWidth: 1,
            borderColor: '#FB850030'
          }}
        >
          <Text style={{ color: '#FB8500', fontWeight: 'bold', marginBottom: 4 }}>
            Sincronização Ativa
          </Text>
          <Text style={{ color: '#6C757D', fontSize: 13 }}>
            Seus dados estão sendo enviados via protocolo seguro para a base Oracle Cloud da AstroTrack.
          </Text>
        </MotiView>
      </Content>
    </Container>
  );
};
