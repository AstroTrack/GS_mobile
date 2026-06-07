import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { driverService } from '../../services/driverService';
import { setApiToken } from '../../services/api';
import { Rocket, ArrowLeft } from 'lucide-react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const Content = styled.ScrollView.attrs({
  contentContainerStyle: { padding: 24 }
})``;

const Header = styled.View`
  padding: 24px;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 24px;
  font-weight: bold;
  margin-left: 16px;
`;

export const Register = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    cnh: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { nome, email, senha, cpf, cnh, telefone } = formData;
    
    if (!nome || !email || !senha || !cpf || !cnh || !telefone) {
      return Alert.alert('Cadastro', 'Preencha todos os campos obrigatórios.');
    }

    if (cpf.length !== 11 || cnh.length !== 11) {
      return Alert.alert('Validação', 'CPF e CNH devem ter 11 dígitos.');
    }

    setLoading(true);
    try {
      const authPayload = {
        usuario: nome,
        email: email,
        senha: senha
      };
      
      const response = await driverService.register(authPayload);
      
      if (response.token) {
        setApiToken(response.token);
      }

      const profilePayload = {
        idMotorista: response.id || response.idMotorista || response.user?.id,
        nome,
        cpf: cpf.replace(/\D/g, ''),
        cnh: cnh.replace(/\D/g, ''),
        telefone,
        status: 'ATIVO'
      };

      await driverService.createProfile(profilePayload);
      
      setLoading(false);
      Alert.alert('Sucesso', 'Conta e perfil criados! Agora você pode fazer login.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error: any) {
      setLoading(false);
      const message = error.response?.data?.mensagem || error.response?.data?.message || 'Falha ao realizar cadastro.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Title>Novo Motorista</Title>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Input 
          label="Nome Completo"
          placeholder="Digite seu nome"
          value={formData.nome}
          onChangeText={(v) => setFormData({ ...formData, nome: v })}
        />

        <Input 
          label="E-mail"
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => setFormData({ ...formData, email: v })}
        />

        <Input 
          label="Telefone (apenas números)"
          placeholder="11999999999"
          keyboardType="phone-pad"
          maxLength={11}
          value={formData.telefone}
          onChangeText={(v) => setFormData({ ...formData, telefone: v.replace(/\D/g, '') })}
        />

        <Input 
          label="CPF (apenas números)"
          placeholder="00000000000"
          keyboardType="numeric"
          maxLength={11}
          value={formData.cpf}
          onChangeText={(v) => setFormData({ ...formData, cpf: v.replace(/\D/g, '') })}
        />

        <Input 
          label="CNH (apenas números)"
          placeholder="00000000000"
          keyboardType="numeric"
          maxLength={11}
          value={formData.cnh}
          onChangeText={(v) => setFormData({ ...formData, cnh: v.replace(/\D/g, '') })}
        />

        <Input 
          label="Senha"
          placeholder="******"
          secureTextEntry
          value={formData.senha}
          onChangeText={(v) => setFormData({ ...formData, senha: v })}
        />

        <Button 
          title="CRIAR MINHA CONTA" 
          onPress={handleRegister} 
          loading={loading}
          style={{ marginTop: 24, marginBottom: 40 }}
        />
      </Content>
    </Container>
  );
};
