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

## 9. Especialidades

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

## 10. Fluxos Principais

### 10.1 Fluxo do Cliente
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

### 10.2 Fluxo do Atendente
1. Faz cadastro como atendente (`isAtendent: true`)
2. Completa perfil (bio, especialidades, serviços, preços)
3. Recebe notificações de novos agendamentos
4. Acessa chat no horário agendado
5. Realiza consulta com cliente
6. Recebe avaliação do cliente

---

## 11. APIs Identificadas

### 11.1 Autenticação
- `POST /user/login` - Login
- `POST /user/signup` - Cadastro
- `GET /user` - Obter dados do usuário logado
- `POST /user/sendVerifyEmail` - Enviar link de verificação
- `GET /user/verifyEmail/:token` - Verificar email via token

### 11.2 Atendentes
- `GET /atendent` - Listar/buscar atendentes (com paginação e filtros)
- `GET /atendent/:id` - Obter dados de um atendente específico

### 11.3 Chat (inferido)
- Endpoints de Socket.io para mensagens em tempo real
- Endpoints para histórico de mensagens
- Endpoints para lista de contatos

### 11.4 Outros (a implementar)
- Endpoints para agendamento
- Endpoints para pagamento
- Endpoints para gestão de minutos
- Endpoints para avaliações/feedbacks
- Endpoints para serviços dos atendentes
- Endpoints para especialidades

---

## 12. Regras de Negócio Importantes

### 12.1 Validações
- Login deve ser único
- Email deve ser verificado antes de usar funcionalidades protegidas
- Agendamentos devem respeitar disponibilidade do atendente
- Pagamento deve ser confirmado antes de criar agendamento

### 12.2 Permissões
- Apenas clientes podem agendar consultas
- Apenas atendentes podem receber agendamentos
- Chat só é acessível entre cliente e atendente que têm agendamento ativo

### 12.3 Estados
- Atendente pode estar "Online" ou "Offline"
- Agendamentos têm estados (pendente, confirmado, em andamento, concluído, cancelado)
- Usuários têm status de verificação (`isVerified`)

---

## 13. Considerações Técnicas para o Backend

### 13.1 Banco de Dados
Entidades principais a considerar:
- **User**: Tabela de usuários (clientes e atendentes)
- **Atendent**: Tabela de atendentes (relacionada com User)
- **Service**: Serviços oferecidos pelos atendentes
- **Appointment/Schedule**: Agendamentos
- **Message**: Mensagens do chat
- **Feedback/Review**: Avaliações dos atendentes
- **Speciality**: Especialidades dos atendentes
- **MinutesTransaction**: Transações de minutos (compra/uso)

### 13.2 Relacionamentos
- User 1:1 Atendent (se `isAtendent = true`)
- Atendent 1:N Service
- Atendent 1:N Appointment
- Atendent 1:N Feedback
- Atendent N:M Speciality
- User 1:N Message (como sender)
- Appointment 1:N Message
- User 1:N MinutesTransaction

### 13.3 Autenticação
- JWT tokens para autenticação
- Token armazenado no frontend como `accessToken`
- Token enviado no header `Authorization: Bearer {token}`

### 13.4 WebSockets
- Socket.io para chat em tempo real
- Rooms por agendamento ou conversa
- Persistência de mensagens no banco

---

## 14. Pontos de Atenção

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

4. **Notificações** (futuro):
   - Notificar atendente de novo agendamento
   - Notificar cliente de confirmação/cancelamento
   - Notificar sobre novas mensagens

---

## 15. Status do Projeto

- ✅ Frontend em desenvolvimento (React + TypeScript + Tailwind)
- ✅ Estrutura de rotas definida
- ✅ Componentes principais criados
- ✅ Integração com APIs parcial (autenticação, busca de atendentes)
- ⏳ Backend a ser desenvolvido
- ⏳ Integração completa de chat
- ⏳ Sistema de pagamento
- ⏳ Sistema completo de agendamento
- ⏳ Gestão de minutos

---

**Nota**: Este documento foi criado com base na análise do código frontend. Algumas funcionalidades podem precisar de ajustes ou detalhamento adicional durante o desenvolvimento do backend.

