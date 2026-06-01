import React from 'react';
import styled from 'styled-components/native';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react-native';

interface TripProps {
  destino: string;
  data: string;
  status: 'EM_ANDAMENTO' | 'FINALIZADA' | 'PLANEJADA' | 'CANCELADA' | string;
  onPress?: () => void;
}

const Container = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: #FFFFFF10;
`;

const Info = styled.View`
  flex: 1;
`;

const Destination = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const DetailText = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 14px;
  margin-left: 8px;
`;

const StatusBadge = styled.View<{ status: string }>`
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 6px;
  background-color: ${({ status }) => {
    if (status === 'EM_ANDAMENTO') return '#FB850020';
    if (status === 'FINALIZADA') return '#4CAF5020';
    if (status === 'CANCELADA') return '#E5393520';
    return '#6C757D20';
  }};
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<{ status: string }>`
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ status }) => {
    if (status === 'EM_ANDAMENTO') return '#FB8500';
    if (status === 'FINALIZADA') return '#4CAF50';
    if (status === 'CANCELADA') return '#E53935';
    return '#6C757D';
  }};
`;

export const TripCard = ({ destino, data, status = 'PLANEJADA', onPress }: TripProps) => {
  const displayStatus = status || 'PLANEJADA';
  
  return (
    <Container activeOpacity={0.7} onPress={onPress}>
      <Info>
        <Destination numberOfLines={1}>{destino}</Destination>
        
        <Row>
          <Calendar size={14} color="#FB8500" />
          <DetailText>{data}</DetailText>
        </Row>
        
        <StatusBadge status={displayStatus}>
          <StatusText status={displayStatus}>
            {String(displayStatus).replace('_', ' ')}
          </StatusText>
        </StatusBadge>
      </Info>
      
      <ChevronRight size={24} color="#FB8500" />
    </Container>
  );
};
