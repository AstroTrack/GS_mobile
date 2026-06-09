import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Hash, User, Mail, Smartphone, CreditCard, LogOut, ArrowLeft, Edit2, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

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

const ProfileCard = styled.View`
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  padding: 24px;
  border-radius: 16px;
  align-items: center;
  margin-bottom: 32px;
`;

const AvatarContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.COLORS.ACCENT};
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const UserName = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 24px;
  font-weight: bold;
`;

const UserEmail = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 16px;
`;

const InfoSection = styled.View`
  margin-bottom: 32px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.SECONDARY};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const InfoLabel = styled.View`
  margin-left: 16px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_SECONDARY};
  font-size: 12px;
  text-transform: uppercase;
`;

const Value = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_PRIMARY};
  font-size: 16px;
  font-weight: 500;
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.DANGER};
  margin-bottom: 40px;
`;

const LogoutText = styled.Text`
  color: ${({ theme }) => theme.COLORS.DANGER};
  font-weight: bold;
  margin-left: 12px;
`;

const ModalContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  width: 100%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  padding-bottom: ${Platform.OS === 'ios' ? '40px' : '24px'};
  max-height: 90%;
`;

const DragIndicator = styled.View`
  width: 40px;
  height: 4px;
  background-color: #6C757D;
  border-radius: 2px;
  align-self: center;
  margin-bottom: 16px;
`;

export const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, fetchProfile, updateProfile } = useProfile();
  
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState({ 
    idMotorista: 0,
    nome: '', 
    telefone: '',
    cpf: '',
    cnh: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        if (data) {
          setEditData({ 
            idMotorista: data.idMotorista || user?.id,
            nome: data.nome, 
            telefone: data.telefone || '',
            cpf: data.cpf,
            cnh: data.cnh,
            status: data.status || 'ATIVO'
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          Alert.alert(
            'Perfil não encontrado',
            `Não conseguimos localizar o motorista com ID ${user?.id}. Se você já tem um cadastro, altere o ID no botão de edição.`,
            [{ text: 'OK' }]
          );
        }
      }
    };
    loadProfile();
  }, [fetchProfile, user?.id]);

  const handleUpdateProfile = async () => {
    const { idMotorista, nome, cpf, cnh, telefone } = editData;
    if (!nome || !cpf || !cnh || !telefone) {
      return Alert.alert('Erro de Validação', 'Todos os campos são obrigatórios.');
    }

    if (cpf.length !== 11 || cnh.length !== 11) {
      return Alert.alert('Erro de Validação', 'CPF e CNH devem ter 11 dígitos.');
    }

    try {
      await updateProfile(Number(idMotorista), editData);
      setIsModalVisible(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Falha ao atualizar perfil:', error);
      const apiMessage = error.response?.data?.mensagem;
      const fieldErrors = error.response?.data?.campos;
      
      let errorMessage = 'Falha ao atualizar perfil.';
      
      if (fieldErrors) {
        const firstField = Object.keys(fieldErrors)[0];
        errorMessage = fieldErrors[firstField];
      } else if (apiMessage) {
        errorMessage = apiMessage;
      }

      Alert.alert('Erro de Validação', errorMessage);
    }
  };

  if (loading && !profile) {
    return (
      <Container>
        <ActivityIndicator color="#FB8500" style={{ flex: 1 }} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <ArrowLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <HeaderTitle>Meu Perfil</HeaderTitle>
        </View>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Edit2 color="#FB8500" size={24} />
        </TouchableOpacity>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <ProfileCard>
            <AvatarContainer>
              <User color="#FFF" size={48} />
            </AvatarContainer>
            <UserName>{profile?.nome || 'Motorista'}</UserName>
            <UserEmail>{profile?.email || user?.email}</UserEmail>
          </ProfileCard>
        </MotiView>

        <InfoSection>
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
          >
            <InfoRow>
              <CreditCard color="#FB8500" size={20} />
              <InfoLabel>
                <Label>CPF</Label>
                <Value>{profile?.cpf || 'Não informado'}</Value>
              </InfoLabel>
            </InfoRow>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 300 }}
          >
            <InfoRow>
              <Smartphone color="#FB8500" size={20} />
              <InfoLabel>
                <Label>CNH</Label>
                <Value>{profile?.cnh || 'Não informado'}</Value>
              </InfoLabel>
            </InfoRow>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 400 }}
          >
            <InfoRow>
              <Mail color="#FB8500" size={20} />
              <InfoLabel>
                <Label>E-mail</Label>
                <Value>{profile?.email || user?.email}</Value>
              </InfoLabel>
            </InfoRow>
          </MotiView>
        </InfoSection>

        <LogoutButton onPress={signOut}>
          <LogOut color="#E53935" size={20} />
          <LogoutText>SAIR DO APLICATIVO</LogoutText>
        </LogoutButton>
      </Content>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ModalContainer onPress={() => setIsModalVisible(false)}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ModalContent>
                <DragIndicator />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>
                    Editar Perfil
                  </Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ padding: 4 }}>
                    <X color="#6C757D" size={24} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Input
                    label="ID do Motorista (Sincronização)"
                    icon={Hash}
                    value={String(editData.idMotorista)}
                    onChangeText={(v) => setEditData({ ...editData, idMotorista: Number(v.replace(/[^0-9]/g, '')) })}
                    keyboardType="numeric"
                  />

                  <Input
                    label="Nome"
                    icon={User}
                    value={editData.nome}
                    onChangeText={(v) => setEditData({ ...editData, nome: v })}
                  />
                  
                  <Input
                    label="Telefone (apenas números)"
                    icon={Smartphone}
                    value={editData.telefone}
                    onChangeText={(v) => setEditData({ ...editData, telefone: v.replace(/\D/g, '') })}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />

                  <Input
                    label="CPF (apenas números)"
                    icon={CreditCard}
                    value={editData.cpf}
                    onChangeText={(v) => setEditData({ ...editData, cpf: v.replace(/\D/g, '') })}
                    keyboardType="numeric"
                    maxLength={11}
                  />

                  <Input
                    label="CNH (apenas números)"
                    icon={CreditCard}
                    value={editData.cnh}
                    onChangeText={(v) => setEditData({ ...editData, cnh: v.replace(/\D/g, '') })}
                    keyboardType="numeric"
                    maxLength={11}
                  />

                  <View style={{ marginTop: 24 }}>
                    <Button 
                      title="SALVAR ALTERAÇÕES" 
                      onPress={handleUpdateProfile}
                      loading={loading}
                    />
                    <TouchableOpacity 
                      onPress={() => setIsModalVisible(false)}
                      style={{ marginTop: 16, marginBottom: 32, alignItems: 'center' }}
                    >
                      <Text style={{ color: '#6C757D', fontWeight: 'bold' }}>CANCELAR</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </Container>
  );
};
