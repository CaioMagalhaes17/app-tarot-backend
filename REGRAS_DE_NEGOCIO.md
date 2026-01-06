# Regras de Negócio - Sistema de Consultas de Tarologia

## Visão Geral do Sistema

Sistema de consultas de tarologia online que conecta **usuários** (clientes) com **atendentes** (consultores de tarot) para realizar consultas pagas através de chat em tempo real. O sistema gerencia agendamentos, pagamentos, comunicação e um sistema de créditos baseado em minutos.

---

## 1. Perfis de Usuário

### 1.1 Usuário (Cliente)

- **Propósito**: Buscar e contratar serviços de consulta de tarot
- **Características**:
  - Pode buscar e visualizar perfis de atendentes
  - Pode agendar consultas
  - Possui saldo de minutos para usar nas consultas
  - Pode avaliar atendentes após consultas
  - Acessa chat para comunicação com atendentes
  - Possui perfil próprio com histórico de consultas

### 1.2 Atendente (Consultor)

- **Propósito**: Oferecer serviços de consulta de tarot
- **Características**:
  - Possui perfil público com informações profissionais
  - Tem especialidades (ex: Tarot do Amor, Mapa Astral, etc.)
  - Possui avaliação (rating) baseada em feedbacks de clientes
  - Oferece múltiplos serviços com preços diferentes
  - Recebe consultas agendadas
  - Comunica-se com clientes via chat
  - Possui bio/descrição profissional

---

## 2. Autenticação e Autorização

### 2.1 Cadastro (Signup)

- **Campos obrigatórios**:

  - `login`: Identificador único (email ou username)
  - `password`: Senha do usuário
  - `name`: Nome completo
  - `isAtendent`: Boolean indicando se é atendente ou cliente
  - `permission`: Nível de permissão do usuário
  - `isVerified`: Status de verificação de email (inicialmente `false`)

- **Regras**:
  - Login deve ser único no sistema
  - Email deve ser verificado através de magic link
  - Usuário não pode acessar funcionalidades protegidas até verificar email

### 2.2 Login

- Autenticação via `login` e `password`
- Retorna token de acesso (armazenado como `accessToken` no localStorage)
- Token é usado em todas as requisições autenticadas

### 2.3 Verificação de Email

- Sistema envia link de verificação por email (`sendVerifyEmail`)
- Link contém token único
- Usuário acessa rota `/auth/magic-link/:token` para verificar
- Após verificação, `isVerified` é atualizado para `true`

### 2.4 Rotas Protegidas

- `/profile`: Perfil do cliente (requer autenticação)
- `/chat`: Chat com atendentes (requer autenticação)
- Outras rotas podem ser acessadas sem autenticação (busca de atendentes, visualização de perfis)

---

## 3. Gestão de Atendentes

### 3.1 Busca de Atendentes

- **Endpoint**: `GET /atendent`
- **Parâmetros**:

  - `page`: Número da página (paginação)
  - `limit`: Quantidade de resultados por página
  - `search`: Termo de busca (opcional) - busca por nome
  - `service`: Filtro por tipo de serviço (opcional)

- **Retorno**:
  - Lista de atendentes com paginação
  - Cada atendente contém: `id`, `name`, `rating`, `bio`, `user` (dados do usuário incluindo `profileImg`)

### 3.2 Visualização de Perfil do Atendente

- **Endpoint**: `GET /atendent/:id`
- **Rota**: `/atendents/profile/:id`
- **Dados exibidos**:
  - Informações pessoais (nome, foto, status online)
  - Rating (avaliação média)
  - Bio/descrição
  - Especialidades (tags)
  - Serviços oferecidos com preços
  - Feedbacks/depoimentos de clientes anteriores

### 3.3 Estrutura de Dados do Atendente

```typescript
{
  id: string,
  name: string,
  rating: number,        // Média de avaliações (0-5)
  bio: string,          // Descrição profissional
  user: {
    id: string,
    login: string,
    name: string,
    profileImg: string,
    isAtendent: boolean,
    isVerified: boolean,
    permission: string,
    createdAt: string
  }
}
```

---

## 4. Sistema de Serviços

### 4.1 Tipos de Serviços

Cada atendente pode oferecer múltiplos serviços, por exemplo:

- Consulta de Tarot Online
- Tirada Rápida (3 cartas)
- Tarot do Amor
- Tarot da Semana/Mês
- Mapa Astral
- Horóscopo do Amor
- Horóscopo do Dia

### 4.2 Estrutura de Serviço

```typescript
{
  img: string,      // Imagem do serviço
  name: string,     // Nome do serviço
  price: number     // Preço em reais
}
```

### 4.3 Regras

- Cada atendente define seus próprios serviços e preços
- Cliente escolhe o serviço durante o agendamento
- Preço é fixo por serviço (não varia por horário)

---

## 5. Sistema de Agendamento

### 5.1 Fluxo de Agendamento

O agendamento segue um processo em 4 etapas:

1. **Cadastro/Login**

   - Se não estiver logado, deve fazer login ou cadastro
   - Se já estiver logado, pode avançar

2. **Escolha do Serviço**

   - Cliente escolhe qual serviço deseja contratar
   - Visualiza preço do serviço selecionado

3. **Escolha de Data e Hora**

   - Cliente seleciona data disponível
   - Cliente seleciona horário disponível
   - Sistema valida disponibilidade do atendente

4. **Pagamento**
   - Cliente realiza pagamento
   - Formas de pagamento: Cartão de Crédito ou PIX
   - Após pagamento confirmado, agendamento é criado

### 5.2 Rota de Agendamento

- **Rota**: `/atendents/profile/:id/schedule`
- **Query Params**: `step` (1-4) indica a etapa atual do processo

### 5.3 Dados do Agendamento

- Atendente selecionado
- Serviço escolhido
- Data e hora selecionadas
- Status do pagamento

---

## 6. Sistema de Chat

### 6.1 Funcionalidades

- Comunicação em tempo real entre cliente e atendente
- Histórico de mensagens
- Lista de contatos (atendentes com quem o cliente já conversou)
- Interface responsiva (mobile e desktop)

### 6.2 Estrutura de Dados

**Contato**:

```typescript
{
  id: string,
  profileImg: string,
  name: string,
  lastMessage: string,
  lastMessageTime: string
}
```

**Mensagem**:

```typescript
{
  id: string,
  text: string,
  time: string,
  sender: ContactType
}
```

### 6.3 Tecnologia

- Utiliza **Socket.io** para comunicação em tempo real
- Mensagens são persistidas para histórico

---

## 7. Sistema de Minutos (Créditos)

### 7.1 Conceito

- Clientes possuem saldo de minutos
- Consultas consomem minutos baseado na duração
- Minutos podem ser comprados/recarregados

### 7.2 Funcionalidades

- Visualização de saldo atual
- Histórico de uso de minutos
- Planos de recarga (diferentes pacotes de minutos)
- FAQ sobre o sistema de minutos

### 7.3 Rota

- **Rota**: `/minutes`
- Exibe informações sobre saldo, planos e histórico

---

## 8. Sistema de Avaliações (Feedbacks)

### 8.1 Estrutura

```typescript
{
  senderName: string,
  date: string,
  rating: number,        // 1-5 estrelas
  description: string    // Comentário do cliente
}
```

### 8.2 Regras

- Clientes podem avaliar atendentes após consultas
- Rating do atendente é calculado como média de todas as avaliações
- Feedbacks são exibidos no perfil público do atendente
- Ajuda outros clientes a escolherem atendentes

---

## 9. Sistema de Notificações

### 9.1 Conceito

Sistema de notificações em tempo real que informa usuários sobre eventos importantes do sistema, como pagamentos aprovados, novos agendamentos, cancelamentos, etc.

### 9.2 Tipos de Notificações

- **`payment_approved`**: Pagamento aprovado com sucesso
- **`appointment_created`**: Novo agendamento criado
- **`appointment_cancelled`**: Agendamento cancelado
- **`general`**: Notificações gerais do sistema

### 9.3 Estrutura de Dados

```typescript
{
  id: string,
  userId: string,
  type: 'payment_approved' | 'appointment_created' | 'appointment_cancelled' | 'general',
  title: string,
  message: string,
  isRead: boolean,
  createdAt: string,
  updatedAt?: string,
  metadata?: {
    paymentOrderId?: string,
    amount?: number,
    productType?: string,
    appointmentId?: string,
    // Outros metadados específicos por tipo
  }
}
```

### 9.4 APIs REST

#### 9.4.1 Listar Notificações

- **Endpoint**: `GET /notifications`
- **Autenticação**: Requerida (JWT)
- **Query Params**:
  - `unreadOnly` (opcional): Se `true`, retorna apenas notificações não lidas
- **Resposta**:

```json
{
  "notifications": [
    {
      "id": "notification_id",
      "userId": "user_id",
      "type": "payment_approved",
      "title": "Pagamento Aprovado",
      "message": "Seu pagamento de R$ 100.00 foi aprovado com sucesso!",
      "isRead": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "metadata": {
        "paymentOrderId": "payment_order_id",
        "amount": 100,
        "productType": "appointment"
      }
    }
  ]
}
```

#### 9.4.2 Marcar Notificação como Lida

- **Endpoint**: `PATCH /notifications/:id/read`
- **Autenticação**: Requerida (JWT)
- **Resposta**:

```json
{
  "message": "Notificação marcada como lida"
}
```

#### 9.4.3 Marcar Todas como Lidas

- **Endpoint**: `PATCH /notifications/read-all`
- **Autenticação**: Requerida (JWT)
- **Resposta**:

```json
{
  "message": "Todas as notificações foram marcadas como lidas"
}
```

### 9.5 WebSocket para Notificações em Tempo Real

#### 9.5.1 Conexão

O frontend deve conectar-se ao namespace `/notifications` do WebSocket usando Socket.io.

**URL de Conexão**: `http://localhost:3000/notifications` (ou URL do backend em produção)

**Autenticação**: O token JWT deve ser enviado no handshake da conexão.

**Exemplo de Conexão (JavaScript/TypeScript)**:

```typescript
import { io } from 'socket.io-client';

const token = localStorage.getItem('accessToken'); // Token JWT do usuário

const socket = io('http://localhost:3000/notifications', {
  auth: {
    token: `Bearer ${token}`,
  },
  transports: ['websocket', 'polling'],
});

// Evento de conexão bem-sucedida
socket.on('connect', () => {
  console.log('Conectado ao WebSocket de notificações');
});

// Evento de erro de conexão
socket.on('connect_error', (error) => {
  console.error('Erro ao conectar:', error);
  // Token inválido ou expirado
});
```

#### 9.5.2 Eventos Recebidos

##### `new_notification`

Emitido quando uma nova notificação é criada para o usuário conectado.

**Payload**:

```typescript
{
  id: string,
  userId: string,
  type: 'payment_approved' | 'appointment_created' | 'appointment_cancelled' | 'general',
  title: string,
  message: string,
  isRead: boolean,
  createdAt: string,
  updatedAt?: string,
  metadata?: Record<string, any>
}
```

**Exemplo de Uso**:

```typescript
socket.on('new_notification', (notification) => {
  console.log('Nova notificação recebida:', notification);

  // Exibir notificação na UI
  showNotificationToast(notification);

  // Atualizar contador de notificações não lidas
  updateUnreadCount();

  // Adicionar à lista de notificações
  addNotificationToList(notification);
});
```

##### `notification_count` (Futuro)

Emitido quando o contador de notificações não lidas é atualizado.

**Payload**:

```typescript
{
  unreadCount: number;
}
```

**Exemplo de Uso**:

```typescript
socket.on('notification_count', (data) => {
  console.log('Contador atualizado:', data.unreadCount);
  updateUnreadBadge(data.unreadCount);
});
```

#### 9.5.3 Gerenciamento de Conexão

**Reconexão Automática**:
O Socket.io já possui reconexão automática, mas é recomendado tratar eventos de desconexão:

```typescript
socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);

  if (reason === 'io server disconnect') {
    // Servidor desconectou, reconectar manualmente
    socket.connect();
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconectado após', attemptNumber, 'tentativas');
});
```

**Desconexão ao Fazer Logout**:

```typescript
function logout() {
  socket.disconnect();
  // ... resto do código de logout
}
```

#### 9.5.4 Exemplo Completo de Hook React

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export function useNotifications() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    const newSocket = io('http://localhost:3000/notifications', {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Conectado ao WebSocket de notificações');
    });

    newSocket.on('new_notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Exibir toast/alert
      // showToast(notification);
    });

    newSocket.on('notification_count', (data: { unreadCount: number }) => {
      setUnreadCount(data.unreadCount);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Erro ao conectar:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, notifications, unreadCount };
}
```

### 9.6 Regras de Negócio

#### 9.6.1 Criação de Notificações

- Notificações são criadas automaticamente pelo sistema em eventos específicos
- Cada notificação é vinculada a um usuário específico (`userId`)
- Notificações não podem ser criadas manualmente pelo frontend

#### 9.6.2 Notificações de Pagamento

- Quando um pagamento é aprovado via webhook, uma notificação do tipo `payment_approved` é criada automaticamente
- O sistema previne duplicação: não cria múltiplas notificações para o mesmo pagamento
- A notificação inclui metadados como `paymentOrderId`, `amount` e `productType`

#### 9.6.3 Leitura de Notificações

- Notificações começam com `isRead: false`
- Usuário pode marcar individualmente ou todas como lidas
- Notificações lidas permanecem no histórico

#### 9.6.4 Segurança

- WebSocket requer autenticação JWT válida
- Notificações são enviadas apenas para o usuário correto (filtro por `userId`)
- Conexões não autenticadas são rejeitadas automaticamente

### 9.7 Integração no Frontend

#### 9.7.1 Componente de Notificações

Recomenda-se criar um componente que:

- Exibe lista de notificações
- Mostra contador de não lidas
- Permite marcar como lida
- Exibe toast/alert para novas notificações em tempo real

#### 9.7.2 Indicador Visual

- Badge com contador de notificações não lidas
- Ícone de sino ou similar
- Destaque visual para novas notificações

#### 9.7.3 Persistência

- Notificações são persistidas no banco de dados
- Frontend pode buscar histórico via API REST
- WebSocket apenas para notificações em tempo real

---

## 10. Especialidades

### 9.1 Conceito

Atendentes possuem especialidades que indicam suas áreas de atuação:

- Tarot Baralho
- Mapa Astral
- Horóscopo
- Etc.

### 9.2 Estrutura

```typescript
{
  id: string,
  name: string,
  description: string
}
```

### 9.3 Uso

- Exibidas como tags no perfil do atendente
- Podem ser usadas como filtro na busca de atendentes

---

## 11. Fluxos Principais

### 11.1 Fluxo do Cliente

1. Acessa a home page
2. Busca atendentes (`/atendents/list`)
3. Visualiza perfil do atendente (`/atendents/profile/:id`)
4. Clica em "Agendar Consulta"
5. Faz login/cadastro (se necessário)
6. Escolhe serviço
7. Seleciona data/hora
8. Realiza pagamento
9. Aguarda confirmação
10. Acessa chat no horário agendado
11. Após consulta, pode avaliar o atendente

### 11.2 Fluxo do Atendente

1. Faz cadastro como atendente (`isAtendent: true`)
2. Completa perfil (bio, especialidades, serviços, preços)
3. Recebe notificações de novos agendamentos
4. Acessa chat no horário agendado
5. Realiza consulta com cliente
6. Recebe avaliação do cliente

---

## 12. APIs Identificadas

### 12.1 Autenticação

- `POST /user/login` - Login
- `POST /user/signup` - Cadastro
- `GET /user` - Obter dados do usuário logado
- `POST /user/sendVerifyEmail` - Enviar link de verificação
- `GET /user/verifyEmail/:token` - Verificar email via token

### 12.2 Atendentes

- `GET /atendent` - Listar/buscar atendentes (com paginação e filtros)
- `GET /atendent/:id` - Obter dados de um atendente específico

### 12.3 Chat (inferido)

- Endpoints de Socket.io para mensagens em tempo real
- Endpoints para histórico de mensagens
- Endpoints para lista de contatos

### 12.4 Notificações

- `GET /notifications` - Listar notificações do usuário
- `PATCH /notifications/:id/read` - Marcar notificação como lida
- `PATCH /notifications/read-all` - Marcar todas como lidas
- WebSocket: `io('/notifications')` - Receber notificações em tempo real

### 12.5 Outros (a implementar)

- Endpoints para agendamento
- Endpoints para pagamento
- Endpoints para gestão de minutos
- Endpoints para avaliações/feedbacks
- Endpoints para serviços dos atendentes
- Endpoints para especialidades

---

## 13. Regras de Negócio Importantes

### 13.1 Validações

- Login deve ser único
- Email deve ser verificado antes de usar funcionalidades protegidas
- Agendamentos devem respeitar disponibilidade do atendente
- Pagamento deve ser confirmado antes de criar agendamento

### 13.2 Permissões

- Apenas clientes podem agendar consultas
- Apenas atendentes podem receber agendamentos
- Chat só é acessível entre cliente e atendente que têm agendamento ativo

### 13.3 Estados

- Atendente pode estar "Online" ou "Offline"
- Agendamentos têm estados (pendente, confirmado, em andamento, concluído, cancelado)
- Usuários têm status de verificação (`isVerified`)

---

## 14. Considerações Técnicas para o Backend

### 14.1 Banco de Dados

Entidades principais a considerar:

- **User**: Tabela de usuários (clientes e atendentes)
- **Atendent**: Tabela de atendentes (relacionada com User)
- **Service**: Serviços oferecidos pelos atendentes
- **Appointment/Schedule**: Agendamentos
- **Message**: Mensagens do chat
- **Feedback/Review**: Avaliações dos atendentes
- **Speciality**: Especialidades dos atendentes
- **MinutesTransaction**: Transações de minutos (compra/uso)

### 14.2 Relacionamentos

- User 1:1 Atendent (se `isAtendent = true`)
- Atendent 1:N Service
- Atendent 1:N Appointment
- Atendent 1:N Feedback
- Atendent N:M Speciality
- User 1:N Message (como sender)
- Appointment 1:N Message
- User 1:N MinutesTransaction

### 14.3 Autenticação

- JWT tokens para autenticação
- Token armazenado no frontend como `accessToken`
- Token enviado no header `Authorization: Bearer {token}`

### 14.4 WebSockets

- **Socket.io** para comunicação em tempo real
- **Chat**: Namespace para mensagens em tempo real, rooms por agendamento ou conversa
- **Notificações**: Namespace `/notifications` para notificações em tempo real
- Persistência de mensagens e notificações no banco

---

## 15. Pontos de Atenção

1. **Segurança**:

   - Validar permissões em todas as rotas protegidas
   - Validar que cliente só acessa chat com atendente que tem agendamento
   - Validar que apenas o dono do perfil pode editar

2. **Performance**:

   - Paginação na busca de atendentes
   - Cache de perfis de atendentes (se aplicável)
   - Otimização de queries com relacionamentos

3. **Validações**:

   - Horários de agendamento devem estar dentro do horário de funcionamento
   - Não permitir agendamentos no passado
   - Validar disponibilidade antes de confirmar agendamento

4. **Notificações**:
   - ✅ Sistema de notificações implementado
   - ✅ WebSocket para notificações em tempo real
   - ✅ Notificações de pagamento aprovado
   - ⏳ Notificações de agendamento (a implementar)
   - ⏳ Notificações de cancelamento (a implementar)

---

## 16. Status do Projeto

- ✅ Frontend em desenvolvimento (React + TypeScript + Tailwind)
- ✅ Estrutura de rotas definida
- ✅ Componentes principais criados
- ✅ Integração com APIs parcial (autenticação, busca de atendentes)
- ✅ Sistema de notificações (backend)
- ✅ WebSocket para notificações em tempo real
- ⏳ Backend a ser desenvolvido (parcial)
- ⏳ Integração completa de chat
- ⏳ Sistema de pagamento (parcial)
- ⏳ Sistema completo de agendamento
- ⏳ Gestão de minutos

---

**Nota**: Este documento foi criado com base na análise do código frontend. Algumas funcionalidades podem precisar de ajustes ou detalhamento adicional durante o desenvolvimento do backend.
