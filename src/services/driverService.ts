import api from './api';

export const driverService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  createProfile: async (data: {
    nome: string;
    cpf: string;
    cnh: string;
    telefone: string;
    status: string;
  }) => {
    const response = await api.post('/motoristas', data);
    return response.data;
  },
  
  getProfile: async (id: number) => {
    const response = await api.get(`/motoristas/${id}`);
    return response.data;
  },

  listAll: async () => {
    const response = await api.get('/motoristas');
    return response.data;
  },

  updateProfile: async (id: number, data: any) => {
    const response = await api.put(`/motoristas/${id}`, {
      ...data,
      idMotorista: id
    });
    return response.data;
  }
};
