import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { driverService } from '../../services/driverService';
import { setApiToken } from '../../services/api';
import { Rocket } from 'lucide-react-native';
import { MotiView } from 'moti';

import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

const Content = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center', padding: 24 }
})``;

const Header = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 28px;
  font-weight: bold;
  margin-top: 16px;
`;

const Subtitle = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 16px;
`;

export const Login = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Login', 'Preencha todos os campos.');
    }

    setLoading(true);
    try {
      const response = await driverService.login({ email, senha: password });
      console.log('[Login] Resposta completa da API:', JSON.stringify(response, null, 2));
      
      const token = response.token || response.jwt;
      
      if (token) {
        setApiToken(token);
      }
      
      // Tenta extrair o ID do motorista de várias formas comuns
      let driverId = response.idMotorista || 
                     response.user?.idMotorista || 
                     response.motorista?.idMotorista || 
                     response.id_motorista ||
                     response.user?.id_motorista ||
                     response.motoristaId || 
                     response.id || 
                     response.user?.id;

      // DISCOVERY LOGIC: Se o ID não veio no login, tenta buscar na lista de motoristas por e-mail ou nome
      if (!driverId) {
        console.log('[Login] ID não encontrado. Iniciando auto-descoberta...');
        try {
          const allDrivers = await driverService.listAll();
          
          // Tenta encontrar por e-mail primeiro (mais seguro)
          const userEmail = email.toLowerCase().trim();
          let found = allDrivers.find((d: any) => 
            (d.email && d.email.toLowerCase().trim() === userEmail) ||
            (d.usuario && d.usuario.email && d.usuario.email.toLowerCase().trim() === userEmail)
          );

          // Se não achou por e-mail, tenta por nome (agressivo)
          if (!found) {
            const normalize = (str: string) => {
              return str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                .replace(/\s+(de|da|do|dos|das)\s+/g, " ") // Remove preposições
                .replace(/[^a-z0-9]/g, "") // Remove tudo que não for letra ou número
                .trim();
            };

            const loginUserName = normalize(response.usuario?.usuario || response.nome || '');
            console.log(`[Login] Nome Normalizado (Auth): "${loginUserName}"`);

            found = allDrivers.find((d: any) => {
              const driverName = normalize(d.nome || '');
              const isMatch = driverName === loginUserName || driverName.includes(loginUserName) || loginUserName.includes(driverName);
              if (isMatch) console.log(`[Login] Match encontrado! "${driverName}" corresponde a "${loginUserName}"`);
              return isMatch;
            });
          }
          
          if (found) {
            driverId = found.idMotorista || found.id_motorista || found.id;
            console.log(`[Login] ID descoberto na lista: ${driverId}`);
          } else {
            console.log('[Login] Nenhum motorista correspondente encontrado na lista.', JSON.stringify(allDrivers));
          }
        } catch (discoveryError) {
          console.error('[Login] Falha na auto-descoberta:', discoveryError);
        }
      }

      console.log(`[Login] ID Identificado Final: ${driverId}`);

      if (!driverId) {
        setLoading(false);
        return Alert.alert('Erro de Perfil', 'Não foi possível localizar o seu ID de motorista. Entre em contato com o suporte.');
      }

      const user = {
        id: driverId,
        nome: response.nome || response.user?.nome || 'Motorista Astro',
        email: response.email || response.user?.email || email,
        cpf: response.cpf || response.user?.cpf || '',
        cnh: response.cnh || response.user?.cnh || ''
      };

      await signIn(token, user);

    } catch (error: any) {
      setLoading(false);
      const message = error.response?.data?.mensagem || error.response?.data?.message || 'Falha na autenticação. Verifique suas credenciais.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
        >
          <Header>
            <Rocket size={64} color="#FB8500" />
            <Title>AstroTrack</Title>
            <Subtitle>Logistics in Orbit</Subtitle>
          </Header>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <Input 
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input 
            label="Senha"
            placeholder="******"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button 
            title="ACESSAR SISTEMA" 
            onPress={handleLogin} 
            loading={loading}
            style={{ marginTop: 24 }}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ 
              color: '#FB8500', 
              textAlign: 'center', 
              marginTop: 16,
              fontWeight: 'bold' 
            }}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000, delay: 1000 }}
        >
          <Text style={{ 
            color: '#6C757D', 
            textAlign: 'center', 
            marginTop: 24 
          }}>
            Esqueceu a senha? Entre em contato com o suporte.
          </Text>
        </MotiView>
      </Content>
    </Container>
  );
};
