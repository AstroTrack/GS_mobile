import api from './api';

export interface Trip {
  idViagem?: number;
  id?: number;
  destino: string;
  origem: string;
  dataInicio: string;
  status: 'PLANEJADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA' | 'AGENDADA';
  idMotorista: number;
  idVeiculo: number;
  idCliente: number;
  quilometragemTotal: number;
}

export const tripService = {
  listRecent: async () => {
    const response = await api.get('/viagens');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/viagens/${id}`);
    return response.data;
  },
  
  createTrip: async (trip: Trip) => {
    const response = await api.post('/viagens', trip);
    return response.data;
  },

  updateTrip: async (id: number, trip: Trip) => {
    const response = await api.put(`/viagens/${id}`, trip);
    return response.data;
  },

  finishTrip: async (id: number, currentTrip: Trip) => {
    // A API Java exige que dataFim >= dataInicio
    const now = new Date();
    const startDate = new Date(currentTrip.dataInicio);
    
    // Se a hora atual for anterior à data de início (por fuso horário ou erro manual), 
    // define o fim como 1 minuto após o início para garantir a validade lógica.
    const finalDate = now > startDate ? now : new Date(startDate.getTime() + 60000);
    
    const response = await api.put(`/viagens/${id}`, {
      ...currentTrip,
      status: 'FINALIZADA',
      dataFim: finalDate.toISOString().split('.')[0] 
    });
    return response.data;
  },

  
  checkIn: async (checkpoint: {
    idViagem: number;
    latitude: number;
    longitude: number;
    dataRegistro: string;
    botaoPanico: boolean;
    portaAberta: boolean;
  }) => {
    const response = await api.post('/checkpoints', checkpoint);
    return response.data;
  }
};
