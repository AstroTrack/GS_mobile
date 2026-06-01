import React from 'react';
import { TouchableOpacityProps, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  type?: 'primary' | 'secondary' | 'danger';
}

const Container = styled.TouchableOpacity<Partial<Props>>`
  width: 100%;
  height: 56px;
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'secondary': return theme.COLORS.SECONDARY;
      case 'danger': return theme.COLORS.DANGER;
      default: return theme.COLORS.ACCENT;
    }
  }};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-vertical: 8px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 16px;
  font-weight: bold;
`;

export const Button = ({ title, loading = false, type = 'primary', ...rest }: Props) => {
  return (
    <Container activeOpacity={0.7} disabled={loading} type={type} {...rest}>
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Title>{title}</Title>
      )}
    </Container>
  );
};
