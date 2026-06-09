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

  discoverDriverId: async (email: string, authResponse: any) => {
    console.log('[driverService] Iniciando auto-descoberta de ID...');
    try {
      const responseList = await api.get('/motoristas');
      const allDrivers = responseList.data;
      
      // Tenta encontrar por e-mail primeiro (Rafa)
      const userEmail = email.toLowerCase().trim();
      let found = allDrivers.find((d: any) => 
        (d.email && d.email.toLowerCase().trim() === userEmail) ||
        (d.usuario && d.usuario.email && d.usuario.email.toLowerCase().trim() === userEmail)
      );

      // Se não achou por e-mail, tenta por nome (Rafa)
      if (!found) {
        const normalize = (str: string) => {
          return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "") // Remove os acentos (Rafa)
            .replace(/\s+(de|da|do|dos|das)\s+/g, " ") // Remove as preposições (Rafa)
            .replace(/[^a-z0-9]/g, "") // Remove tudo que não for letra ou número (Rafa)
            .trim();
        };

        const loginUserName = normalize(authResponse.usuario?.usuario || authResponse.nome || '');
        console.log(`[driverService] Nome Normalizado (Auth): "${loginUserName}"`);

        found = allDrivers.find((d: any) => {
          const driverName = normalize(d.nome || '');
          const isMatch = driverName === loginUserName || driverName.includes(loginUserName) || loginUserName.includes(driverName);
          return isMatch;
        });
      }
      
      if (found) {
        const discoveredId = found.idMotorista || found.id_motorista || found.id;
        console.log(`[driverService] ID descoberto: ${discoveredId}`);
        return discoveredId;
      }
    } catch (error) {
      console.error('[driverService] Falha na auto-descoberta:', error);
    }
    return null;
  },

  updateProfile: async (id: number, data: any) => {
    const response = await api.put(`/motoristas/${id}`, {
      ...data,
      idMotorista: id
    });
    return response.data;
  }
};
