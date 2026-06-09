# DOCUMENTAÇÃO TÉCNICA - PROJETO ASTROTRACK (MOBILE)

## 1. Visão Geral do Projeto
O **AstroTrack** é uma plataforma de gerenciamento logístico e monitoramento para motoristas. O aplicativo permite o acompanhamento de viagens, check-ins geolocalizados, monitoramento de status de dispositivos IoT (ESP32) e gestão de perfil, focando em segurança e eficiência operacional.


## 2. Arquitetura e Estrutura de Pastas
O projeto utiliza **React Native com Expo** (Managed Workflow) e **TypeScript**. A organização segue uma separação clara de responsabilidades seguindo princípios de **Clean Architecture**:

- `/src/components`: Componentes de UI atômicos e reutilizáveis (Input, Button, TripCard).
- `/src/hooks`: Camada de Controle/Hooks que centraliza a lógica de negócio e o gerenciamento de estado:
    - `useAuth`: Gerenciamento de sessão e autenticação.
    - `useTrips`: Operações de viagens (CRUD, filtros, contagem e ações de check-in).
    - `useLocation`: Abstração para permissões de GPS e captura de coordenadas.
    - `useProfile`: Gerenciamento de dados do motorista e sincronização de perfil.
- `/src/navigation`: Configuração das rotas e fluxos de navegação.
- `/src/screens`: Camada de View simplificada, responsável apenas pela interface e interação do usuário.
- `/src/services`: Camada de infraestrutura para chamadas de API (Axios).
- `/src/theme`: Definições de estilos globais e contrato de tipagem para o TypeScript (`styled.d.ts`).
- `/src/utils`: Funções auxiliares.

## 3. Stack Tecnológica e Bibliotecas Principais
As escolhas técnicas visam performance, manutenibilidade e uma experiência de usuário rica:
- **React Native & Expo**: Base do desenvolvimento mobile multiplataforma.
- **Styled Components**: Utilizado para CSS-in-JS, garantindo estilos encapsulados e dinâmicos.
- **React Navigation**: Gerenciamento de pilhas (Stack) e abas (Bottom Tabs).
- **Axios**: Cliente HTTP para comunicação com o backend, configurado com interceptors para tokens JWT.
- **Moti & Reanimated**: Bibliotecas para animações fluidas e interativas.
- **Lucide React Native**: Conjunto de ícones consistentes e modernos.
- **Expo Location**: Utilizado para captura de coordenadas em tempo real durante o Check-in.
- **Async Storage**: Persistência local de dados (token de autenticação e dados do usuário).
- **TypeScript**: Utilizado em todo o projeto com contratos de tipagem forte, incluindo definições para o tema global do Styled Components.

## 4. Fluxo de Navegação
O aplicativo implementa uma navegação condicional baseada no estado de autenticação:
1.  **Auth Flow (Stack Navigator)**:
    - Login
    - Registro
2.  **Main Flow (Bottom Tab Navigator)**:
    - Dashboard (Home)
    - Nova Viagem
    - Status (Monitoramento)
    - Histórico
    - Perfil
3.  **App Flow Extra**:
    - Tela de Check-In (Acessada a partir de uma viagem ativa no Dashboard).

## 5. Integração com o Backend (API)
A comunicação é centralizada na pasta `src/services`:

- **api.ts**: Configura a instância global do Axios. Detecta dinamicamente se deve usar `localhost` ou o IP da rede (útil para testes em dispositivos físicos).
- **driverService.ts**: Autenticação, cadastro e lógica de auto-descoberta de ID de motorista baseada em e-mail/nome.
- **tripService.ts**: Operações de CRUD de viagens (`/trips`) e registros de check-in (`/trips/{id}/checkins`).

### Padrão de Autenticação
- Utiliza **Bearer Token (JWT)**.
- O token é armazenado no `AsyncStorage` e injetado automaticamente nos headers de cada requisição via interceptors no `api.ts`.

## 6. Lógica de Negócio e Hooks Customizados
O projeto extrai a complexidade das telas para Hooks especializados, garantindo que as Views permaneçam limpas:

- **Desacoplamento das Views**: As telas em `src/screens` não chamam serviços diretamente. Elas utilizam os Hooks, que por sua vez orquestram as chamadas aos serviços e gerenciam o estado necessário.
- **Filtragem e Processamento**: Lógicas como o filtro de histórico de viagens e a contagem de status para o Dashboard são processadas dentro do `useTrips` utilizando `useMemo`.
- **Gestão de Localização**: O hook `useLocation` centraliza a interação com o hardware de GPS, fornecendo um estado consistente de coordenadas.
- **Sincronização de Perfil**: O `useProfile` garante que alterações no ID do motorista sejam sincronizadas entre o backend e o estado global de autenticação.
- **Auto-descoberta de Perfil**: O `driverService` inclui lógica de contingência para identificar o ID do motorista durante o login caso o backend retorne dados parciais.

## 7. Observações para o Backend
- O frontend espera que as datas sejam retornadas no padrão ISO 8601.
- As coordenadas são enviadas como números decimais (float).
- Em caso de erro 401 (Não autorizado), o frontend está preparado para limpar a sessão e redirecionar ao Login.
