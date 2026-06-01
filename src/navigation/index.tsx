import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../screens/Auth/Login';
import { Register } from '../screens/Auth/Register';
import { Dashboard } from '../screens/Main/Dashboard';
import { CheckIn } from '../screens/Main/CheckIn';
import { Profile } from '../screens/Main/Profile';
import { NewTrip } from '../screens/Main/NewTrip';
import { History } from '../screens/Main/History';
import { Status } from '../screens/Main/Status';
import { ActivityIndicator, View } from 'react-native';
import { LayoutDashboard, PlusCircle, History as HistoryIcon, User, Satellite } from 'lucide-react-native';
import { useTheme } from 'styled-components/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.COLORS.SECONDARY,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.COLORS.ACCENT,
        tabBarInactiveTintColor: theme.COLORS.TEXT_SECONDARY,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Status" 
        component={Status} 
        options={{
          tabBarLabel: 'Sinal',
          tabBarIcon: ({ color, size }) => <Satellite color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="NewTrip" 
        component={NewTrip} 
        options={{
          tabBarLabel: 'Nova Viagem',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="History" 
        component={History} 
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => <HistoryIcon color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export const Routes = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B132B' }}>
        <ActivityIndicator size="large" color="#FB8500" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="CheckIn" component={CheckIn} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};
