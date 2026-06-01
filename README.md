# AstroTrack - Logistics in Orbit
![Expo](https://img.shields.io/badge/expo-FB8500?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0B132B?style=for-the-badge&logo=react&logoColor=61DAFB)
![Styled Components](https://img.shields.io/badge/styled--components-FB8500?style=for-the-badge&logo=styled-components&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-0B132B?style=for-the-badge&logo=typescript&logoColor=white)

**AstroTrack** é uma solução avançada de monitoramento logístico desenvolvida para a **Global Solution**. O aplicativo permite que motoristas gerenciem viagens, realizem check-ins de telemetria e monitorem a segurança da carga em tempo real, utilizando uma interface inspirada na exploração espacial e conectividade satelital.

## Funcionalidades Principais

- **Autenticação Segura**: Fluxo completo de login e registro integrado com backend Java/Spring.
- **Dashboard Operacional**: Visão geral das viagens ativas, agendadas e estatísticas de desempenho.
- **Gestão de Perfil**: Controle total sobre dados profissionais (CNH, CPF, Telefone) com sincronização dinâmica de ID.
- **Rastreamento de Viagens**: Registro de novas rotas, monitoramento de status e histórico detalhado.
- **Telemetria de Check-in**: Envio de coordenadas geográficas, status de porta e botão de pânico para segurança máxima.
- **Interface Futurista**: Design responsivo com animações fluidas utilizando `Moti` e `Lucide Icons`.

## Stack Tecnológica

### Core
- **React Native (Expo)**: Framework principal para desenvolvimento cross-platform.
- **TypeScript**: Garantia de tipagem estática e maior manutenibilidade.
- **React Navigation**: Gerenciamento de rotas e navegação em pilha/tabs.

### UI & UX
- **Styled Components**: Estilização baseada em componentes (CSS-in-JS).
- **Moti**: Animações performáticas baseadas em Reanimated.
- **Lucide React Native**: Pacote de ícones minimalistas e modernos.
- **Google Fonts (Inter/Bold)**: Tipografia otimizada para leitura.

### Integração
- **Axios**: Cliente HTTP para comunicação com a API REST.
- **Async Storage**: Persistência de dados local (Tokens e Sessão).
- **Context API**: Gerenciamento de estado global de autenticação.

## Como Executar

### Pré-requisitos
- Node.js instalado.
- Expo Go instalado no seu smartphone ou emulador configurado.

### Instalação
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` na raiz do projeto:
   ```env
   EXPO_PUBLIC_API_URL=https://astrotrack-api.onrender.com
   ```
4. Inicie o projeto:
   ```bash
   npx expo start
   ```

## Arquitetura do Projeto

```text
src/
├── assets/       # Imagens e vetores estáticos
├── components/   # Componentes atômicos reutilizáveis
├── hooks/        # Hooks customizados e contextos (Auth)
├── navigation/   # Configurações de rotas (Stack/Tabs)
├── screens/      # Telas principais (Auth e Main)
├── services/     # Integração com APIs (Axios)
├── theme/        # Definições globais de cores e estilos
└── utils/        # Funções utilitárias e helpers
```

## Segurança e Telemetria

O sistema está preparado para integração com dispositivos **IoT (ESP32)**, permitindo o envio de dados via protocolo HTTP/REST para o backend Oracle, garantindo que cada quilômetro da viagem seja monitorado orbitalmente.

## Vídeo Demonstração
[Youtube]() - Demonstração

## Autores
Artur Correia - [GitHub](https://github.com/artcorreia)<br>
Gabriel H - [GitHub](https://github.com/gabrielhensg)<br>
José Ricardo - [GitHub](https://github.com/jr-iannuzzi)<br> 
Rafael de Freitas - [GitHub](https://github.com/devfreitas)<br> 
Rafael Pascotte - [GitHub](https://github.com/pascotterafaaa)
