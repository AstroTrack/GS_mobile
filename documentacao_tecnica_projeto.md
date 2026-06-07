# DOCUMENTAÇÃO TÉCNICA - PROJETO ASTROTRACK (MOBILE)

## 1. Visão Geral do Projeto
O **AstroTrack** é uma plataforma de gerenciamento logístico e monitoramento para motoristas. O aplicativo permite o acompanhamento de viagens, check-ins geolocalizados, monitoramento de status de dispositivos IoT (ESP32) e gestão de perfil, focando em segurança e eficiência operacional.


## 2. Arquitetura e Estrutura de Pastas
O projeto utiliza **React Native com Expo** (Managed Workflow) e **TypeScript**. A organização segue uma separação clara de responsabilidades:

- `/src/components`: Componentes de UI atômicos e reutilizáveis (Input, Button, TripCard).
- `/src/hooks`: Hooks customizados para gerenciamento de lógica global (ex: `useAuth` para autenticação).
- `/src/navigation`: Configuração das rotas e fluxos de navegação.
- `/src/screens`: Telas divididas por contexto:
    - `/Auth`: Fluxo de Login e Registro.
    - `/Main`: Funcionalidades principais (Dashboard, CheckIn, History, NewTrip, Profile, Status).
- `/src/services`: Camada de abstração para chamadas de API (Axios).
- `/src/theme`: Definições de cores, fontes e estilos globais (Styled Components).
- `/src/utils`: Funções auxiliares (ex: lógica para capturar URL da API dependendo do ambiente).

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
- **driverService.ts**: Endpoints de autenticação (`/auth/login`) e cadastro (`/drivers`).
- **tripService.ts**: Operações de CRUD de viagens (`/trips`) e registros de check-in (`/trips/{id}/checkins`).

### Padrão de Autenticação
- Utiliza **Bearer Token (JWT)**.
- O token é armazenado no `AsyncStorage` e injetado automaticamente nos headers de cada requisição via interceptors no `api.ts`.

## 6. Funcionalidades e Lógica de Negócio
- **Gestão de Viagens**: Criação de novas rotas, listagem de viagens ativas/concluídas e opção de exclusão.
- **Check-In e Geoposicionamento**: Durante uma viagem, o motorista registra sua posição. O app captura Latitude/Longitude e envia ao backend.
- **Botão de Pânico**: Integrado na tela de Check-In para alertas imediatos de segurança.
- **Monitoramento de Status**: Uma tela dedicada para simular/verificar a conexão com satélites e a saúde de dispositivos ESP32, simulando telemetria IoT.
- **Persistência de Sessão**: Ao abrir o app, o `useAuth` verifica se existe um token válido, permitindo o login automático.

## 7. Observações para o Backend
- O frontend espera que as datas sejam retornadas no padrão ISO 8601.
- As coordenadas são enviadas como números decimais (float).
- Em caso de erro 401 (Não autorizado), o frontend está preparado para limpar a sessão e redirecionar ao Login.