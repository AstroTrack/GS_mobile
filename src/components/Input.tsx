import React from 'react';
import { TextInputProps, View } from 'react-native';
import styled from 'styled-components/native';
import { LucideIcon } from 'lucide-react-native';

interface Props extends TextInputProps {
  label?: string;
  icon?: LucideIcon;
}

const Container = styled.View`
  width: 100%;
  margin-vertical: 8px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 14px;
  margin-bottom: 4px;
  margin-left: 4px;
  font-weight: bold;
`;

const InputContainer = styled.View<{ isFocused: boolean }>`
  width: 100%;
  height: 56px;
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ isFocused, theme }) => isFocused ? theme.COLORS.ACCENT : 'transparent'};
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 16px;
  margin-left: 12px;
`;

export const Input = ({ label, icon: Icon, ...rest }: Props) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer isFocused={isFocused}>
        {Icon && <Icon color={isFocused ? "#FB8500" : "#6C757D"} size={20} />}
        <StyledInput 
          placeholderTextColor="#6C757D"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest} 
        />
      </InputContainer>
    </Container>
  );
};
