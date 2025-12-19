# Fluxo de Agendamento - Sistema de Consultas de Tarot

## 📋 Visão Geral

Este documento descreve o fluxo completo de relacionamento entre as entidades principais do sistema: **Atendente**, **AtendentService**, **Appointment** e **Usuário Comum**.

---

## 🏗️ Arquitetura das Entidades

### 1. **User (Usuário)**

Entidade base que representa qualquer pessoa no sistema (cliente ou atendente).

```typescript
{
  id: string;
  login: string;
  name: string;
  isAtendent: boolean; // Define se é atendente ou cliente
  isVerified: boolean;
  profileImg: string;
  // ... outros campos
}
```

### 2. **Atendent (Atendente)**

Perfil profissional do consultor de tarot. Criado quando um usuário se registra como atendente.

```typescript
{
  id: string;
  user: UserEntity; // Relacionamento 1:1 com User
  name: string; // Nome profissional
  bio: string; // Descrição profissional
  rating: number; // Avaliação média (0-5)
  schedule: Schedule; // Horários de trabalho por dia da semana
}
```

**Relacionamento:**

- `User` 1:1 `Atendent` (quando `user.isAtendent === true`)

### 3. **Service (Serviço)**

Catálogo geral de serviços disponíveis no sistema (definidos pela plataforma).

```typescript
{
  id: string;
  name: string; // Ex: "Consulta de Tarot", "Mapa Astral"
  description: string; // Descrição padrão do serviço
  serviceImg: string; // Imagem do serviço
}
```

**Exemplos de serviços:**

- Consulta de Tarot Online
- Tirada Rápida (3 cartas)
- Tarot do Amor
- Mapa Astral
- Horóscopo do Amor
- Horóscopo do Dia

### 4. **AtendentService (Serviço Customizado do Atendente)**

Personalização de um serviço do catálogo por um atendente específico.

```typescript
{
  id: string;
  atendent: AtendentEntity; // Atendente que oferece este serviço
  service: ServicesEntity; // Serviço base do catálogo
  description: string; // Descrição personalizada do atendente
  price: number; // Preço definido pelo atendente
  isActive: boolean; // Se o serviço está ativo
}
```

**Relacionamentos:**

- `Atendent` 1:N `AtendentService` (um atendente pode ter vários serviços)
- `Service` 1:N `AtendentService` (um serviço pode ser usado por vários atendentes)

**Características:**

- Cada atendente escolhe quais serviços do catálogo ele quer oferecer
- Cada atendente define seu próprio preço para cada serviço
- Cada atendente pode escrever sua própria descrição do serviço
- O atendente pode ativar/desativar serviços

### 5. **Appointment (Agendamento)**

Consulta agendada entre um cliente e um atendente para um serviço específico.

```typescript
{
  id: string;
  user: UserEntity;                    // Cliente que agendou
  atendentService: AtendentServiceEntity; // Serviço escolhido
  date: Date;                          // Data do agendamento
  startTime: string;                   // Horário de início (HH:MM)
  endTime: string;                     // Horário de fim (HH:MM)
  status: AppointmentStatus;           // scheduled | on-going | completed | canceled
  canceledReason?: string;             // Motivo do cancelamento (se aplicável)
}
```

**Relacionamentos:**

- `User` 1:N `Appointment` (um cliente pode ter vários agendamentos)
- `AtendentService` 1:N `Appointment` (um serviço pode ter vários agendamentos)

---

## 🔄 Fluxo Completo do Sistema

### **Fase 1: Configuração do Atendente**

#### 1.1. Cadastro do Atendente

```
1. Usuário se cadastra no sistema com isAtendent = true
2. Sistema cria registro na tabela User
3. Atendente faz login e acessa área de configuração
```

#### 1.2. Criação do Perfil de Atendente

```
Endpoint: POST /atendent
Payload: {
  name: "João Silva",
  bio: "Consultor de tarot experiente há 10 anos...",
  schedule: {
    monday: [{ start: "09:00", end: "18:00" }],
    tuesday: [{ start: "09:00", end: "18:00" }],
    // ... outros dias
  }
}

Resultado: Cria registro em Atendent vinculado ao User
```

#### 1.3. Escolha e Customização de Serviços

```
Endpoint: POST /atendent-service/choose
Payload: [
  {
    id: "service_id_1",              // ID do serviço do catálogo
    customDescription: "Minha consulta personalizada...",
    price: 50.00
  },
  {
    id: "service_id_2",
    customDescription: "Tirada rápida com foco em relacionamentos",
    price: 30.00
  }
]

Resultado: Cria registros em AtendentService para cada serviço escolhido
```

**O que acontece:**

- Atendente visualiza todos os serviços disponíveis no catálogo (`Service`)
- Atendente seleciona quais serviços quer oferecer
- Para cada serviço, define:
  - Preço personalizado
  - Descrição personalizada
- Sistema cria `AtendentService` vinculando `Atendent` + `Service` + customizações

#### 1.4. Gerenciamento de Serviços

```
Atualizar serviço:
PUT /atendent-service/:id
{ description: "...", price: 60.00 }

Desativar serviço:
DELETE /atendent-service/exclude/:id
```

---

### **Fase 2: Busca e Visualização (Cliente)**

#### 2.1. Buscar Atendentes

```
Endpoint: GET /atendent?page=1&limit=10&search=joão

Retorna: Lista paginada de atendentes com:
- Nome, bio, rating
- Foto de perfil
- Status online/offline
```

#### 2.2. Visualizar Perfil do Atendente

```
Endpoint: GET /atendent/:id

Retorna: {
  id, name, bio, rating,
  user: { profileImg, name, ... },
  // ... outros dados
}
```

#### 2.3. Visualizar Serviços do Atendente

```
Endpoint: GET /atendent-service/by-atendent/:id

Retorna: [
  {
    id: "atendent_service_id_1",
    service: {
      id: "service_id_1",
      name: "Consulta de Tarot",
      serviceImg: "..."
    },
    description: "Minha consulta personalizada...",
    price: 50.00,
    isActive: true
  },
  // ... outros serviços
]
```

#### 2.4. Verificar Disponibilidade

```
Endpoint: GET /atendent/:id/availability?startDate=2024-01-15&endDate=2024-01-30

Retorna: {
  days: [
    {
      date: "2024-01-15",
      weekday: "monday",
      availableSlots: [
        { start: "09:00", end: "09:30" },
        { start: "09:30", end: "10:00" },
        // ...
      ]
    }
  ]
}
```

---

### **Fase 3: Agendamento e Pagamento (Cliente)**

#### 3.1. Processo de Agendamento com Pagamento (5 Etapas)

**Etapa 1: Autenticação**

- Cliente faz login ou cadastro
- Sistema valida autenticação

**Etapa 2: Escolha do Serviço**

- Cliente visualiza serviços disponíveis do atendente
- Cliente seleciona um `AtendentService`
- Visualiza preço e descrição personalizada

**Etapa 3: Escolha de Data e Hora**

- Cliente visualiza disponibilidade do atendente
- Seleciona data e horário disponível
- Sistema valida:
  - Data não pode ser no passado
  - Horário deve estar dentro do schedule do atendente
  - Horário não pode estar ocupado por outro agendamento

**Etapa 4: Criação do Payment Order**

- Cliente solicita criação do pagamento
- Sistema valida novamente a disponibilidade (dupla validação)
- Sistema cria `PaymentOrder` com metadados do agendamento
- Sistema cria preferência de pagamento no Mercado Pago
- Sistema retorna `checkoutUrl` (URL do Checkout Pro do Mercado Pago)

**Etapa 5: Confirmação do Pagamento e Criação do Agendamento**

- Frontend redireciona cliente para `checkoutUrl` (Checkout Pro do Mercado Pago)
- Cliente realiza pagamento no site do Mercado Pago
- Mercado Pago processa o pagamento e envia webhook
- Sistema recebe webhook de confirmação do Mercado Pago
- Sistema cria `Appointment` automaticamente após confirmação do pagamento

#### 3.2. Criação do Payment Order para Agendamento

```
Endpoint: POST /appointment/payment
Headers: Authorization: Bearer {token}
Payload: {
  atendentServiceId: "atendent_service_id_1",
  date: "2024-01-15",
  startTime: "10:00",
  endTime: "10:30"
}

Processo interno:
1. Valida se atendentService existe e está ativo
2. Valida se a data não está no passado
3. Valida disponibilidade do atendente (primeira validação)
4. Verifica se o horário escolhido está disponível
5. Cria preferência de pagamento no Mercado Pago (Checkout Pro)
6. Cria PaymentOrder com:
   - amount: preço do atendentService
   - productType: "appointment"
   - description: JSON com metadados do agendamento
   - externalId: ID da preferência do Mercado Pago
7. Retorna { id, externalId, checkoutUrl }

Resposta:
{
  id: "payment_order_id",
  externalId: "preference_id_mercado_pago",
  checkoutUrl: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

#### 3.3. Processamento do Pagamento via Webhook

```
Fluxo automático após pagamento confirmado:

1. Mercado Pago envia webhook: payment (tipo de evento)
2. Sistema busca o pagamento no Mercado Pago usando o payment_id
3. Sistema identifica a preferência associada ao pagamento
4. Sistema busca PaymentOrder usando o preference_id como externalId
5. Sistema atualiza PaymentOrder.status = "completed"
6. Sistema publica evento: PaymentOrderSucceed
7. PaymentOrderCompletedFactory identifica productType = "appointment"
8. ProcessAppointmentPaymentUseCase é executado:
   - Valida se pagamento está completed
   - Verifica idempotência (se já existe appointment)
   - Extrai metadados do description
   - Valida disponibilidade novamente (segunda validação)
   - Cria AppointmentEntity vinculado ao PaymentOrder
```

#### 3.4. Estrutura do Agendamento Criado

```
Appointment {
  id: "appointment_id",
  user: User (cliente),
  atendentService: {
    atendent: {
      user: User (atendente),
      name, bio, rating, schedule
    },
    service: {
      name, description, serviceImg
    },
    description: "Descrição personalizada",
    price: 50.00
  },
  date: "2024-01-15",
  startTime: "10:00",
  endTime: "10:30",
  status: "scheduled",
  paymentOrderId: "payment_order_id"  // Vinculado ao pagamento
}
```

#### 3.5. Validações Duplas de Disponibilidade

O sistema realiza **duas validações** de disponibilidade para garantir integridade:

1. **Primeira Validação (Antes do Pagamento)**

   - Quando o cliente solicita criar o payment order
   - Garante que o horário ainda está disponível antes de iniciar o pagamento
   - Evita que o cliente pague por um horário já ocupado

2. **Segunda Validação (Após Confirmação do Pagamento)**
   - Quando o webhook confirma o pagamento
   - Garante que o horário ainda está disponível no momento da criação do agendamento
   - Evita conflitos caso outro agendamento tenha sido criado entre a primeira validação e a confirmação do pagamento

---

### **Fase 4: Gerenciamento de Agendamentos**

#### 4.1. Visualizar Agendamentos do Cliente

```
Endpoint: GET /appointment/by-user
Headers: Authorization: Bearer {token}

Retorna: Lista de agendamentos do usuário logado com:
- Dados do atendente
- Serviço escolhido
- Data, horário, status
```

#### 4.2. Visualizar Agendamentos do Atendente

```
Endpoint: GET /appointment/by-atendent/:id
Headers: Authorization: Bearer {token}

Retorna: Lista de agendamentos do atendente
```

#### 4.3. Atualizar Status do Agendamento

```
Endpoint: PUT /appointment/:id
Payload: {
  status: "on-going" | "completed" | "canceled",
  canceledReason?: "Motivo do cancelamento"
}
```

**Estados do Agendamento:**

- `scheduled`: Agendado e aguardando
- `on-going`: Consulta em andamento
- `completed`: Consulta finalizada
- `canceled`: Agendamento cancelado

---

## 🔗 Diagrama de Relacionamentos

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1:1 (se isAtendent = true)
     │
     ▼
┌─────────────┐
│  Atendent   │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌──────────────────┐      ┌──────────┐
│ AtendentService  │◄─────┤ Service  │
└────────┬─────────┘  N:1 └──────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────┐      ┌─────────┐
│ Appointment  │◄─────┤  User   │
└──────────────┘  N:1 └─────────┘
```

---

## 📊 Fluxo de Dados Completo

### **Cenário: Cliente agenda consulta**

```
1. Cliente busca atendentes
   GET /atendent → Lista de atendentes

2. Cliente visualiza perfil do atendente
   GET /atendent/:id → Dados do atendente

3. Cliente visualiza serviços disponíveis
   GET /atendent-service/by-atendent/:id → Serviços customizados

4. Cliente verifica disponibilidade
   GET /atendent/:id/availability → Horários disponíveis

5. Cliente escolhe serviço e horário
   (Frontend: seleção de AtendentService + data/hora)

6. Cliente solicita criação do pagamento
   POST /appointment/payment → Retorna checkoutUrl

7. Frontend redireciona cliente para checkoutUrl (Mercado Pago Checkout Pro)
   Cliente realiza pagamento no site do Mercado Pago

8. Mercado Pago processa pagamento e envia webhook
   Sistema recebe webhook e cria Appointment automaticamente

9. Cliente visualiza agendamento
   GET /appointment/by-user → Lista de agendamentos
```

---

## 🎯 Pontos Importantes

### **Sobre AtendentService:**

- ✅ Permite que cada atendente tenha preços diferentes para o mesmo serviço
- ✅ Permite descrições personalizadas por atendente
- ✅ Permite que atendentes escolham quais serviços oferecer
- ✅ Permite ativar/desativar serviços sem deletar

### **Sobre Appointment:**

- ✅ Sempre vinculado a um `AtendentService` (não diretamente a `Service`)
- ✅ Contém todas as informações necessárias: atendente, serviço, preço, cliente
- ✅ Status permite rastrear o ciclo de vida da consulta
- ✅ Data e horário são validados contra disponibilidade do atendente
- ✅ **Vinculado a um `PaymentOrder` através de `paymentOrderId`**
- ✅ **Criado apenas após confirmação do pagamento via webhook**
- ✅ **Validação dupla de disponibilidade** (antes do pagamento e antes de criar)

### **Sobre Disponibilidade:**

- ✅ Calculada baseada no `schedule` do atendente
- ✅ Exclui horários já ocupados por agendamentos ativos
- ✅ Não considera agendamentos cancelados
- ✅ Retorna slots de 30 minutos

---

## 🔐 Regras de Negócio

1. **Apenas usuários autenticados podem agendar**
2. **Apenas atendentes podem ter serviços customizados**
3. **Um atendente não pode ter o mesmo serviço duas vezes** (validação no `ChooseServicesUseCase`)
4. **Agendamentos não podem ser criados no passado**
5. **Agendamentos devem respeitar o schedule do atendente**
6. **Agendamentos não podem sobrepor horários já ocupados**
7. **Apenas o dono do agendamento pode cancelar**
8. **Agendamentos são criados APENAS após confirmação do pagamento via webhook**
9. **Disponibilidade é validada DUAS VEZES**: antes do pagamento e antes de criar o agendamento
10. **PaymentOrder armazena metadados do agendamento no campo `description` (JSON)**
11. **Appointment é vinculado ao PaymentOrder através de `paymentOrderId`**
12. **Processo é idempotente**: se o agendamento já existe para um paymentOrder, não cria duplicado

---

## 📝 Exemplo Prático Completo

### **Setup do Atendente:**

```javascript
// 1. Usuário se registra como atendente
POST /user/signup
{ login: "joao@email.com", isAtendent: true, ... }

// 2. Cria perfil de atendente
POST /atendent
{ name: "João Silva", bio: "...", schedule: {...} }

// 3. Escolhe serviços do catálogo
POST /atendent-service/choose
[
  { id: "service_1", customDescription: "Minha consulta...", price: 50 },
  { id: "service_2", customDescription: "Tirada rápida...", price: 30 }
]
```

### **Cliente Agenda Consulta:**

```javascript
// 1. Busca atendentes
GET /atendent?search=joão

// 2. Vê serviços disponíveis
GET /atendent-service/by-atendent/:atendent_id
// Retorna: [{ id: "atendent_service_1", price: 50, ... }]

// 3. Verifica disponibilidade
GET /atendent/:atendent_id/availability

// 4. Cria payment order para agendamento
POST /appointment/payment
{
  atendentServiceId: "atendent_service_1",
  date: "2024-01-15",
  startTime: "10:00",
  endTime: "10:30"
}
// Retorna: { id: "payment_order_id", externalId: "preference_id", checkoutUrl: "https://..." }

// 5. Frontend redireciona cliente para checkoutUrl (Mercado Pago Checkout Pro)
// 6. Cliente realiza pagamento no site do Mercado Pago
// 7. Mercado Pago envia webhook de confirmação
// 8. Sistema cria Appointment automaticamente após confirmação
```

---

## 🚀 Endpoints Principais

### **Atendente:**

- `GET /atendent` - Listar atendentes
- `GET /atendent/:id` - Ver perfil do atendente
- `GET /atendent/:id/availability` - Ver disponibilidade
- `POST /atendent` - Criar perfil (autenticado)
- `PUT /atendent` - Atualizar perfil (autenticado)

### **Serviços do Atendente:**

- `GET /atendent-service/by-atendent/:id` - Listar serviços do atendente
- `GET /atendent-service/:id` - Ver detalhes do serviço
- `POST /atendent-service/choose` - Escolher serviços (autenticado - atendente)
- `PUT /atendent-service/:id` - Atualizar serviço (autenticado - atendente)
- `DELETE /atendent-service/exclude/:id` - Desativar serviço (autenticado - atendente)

### **Agendamentos:**

- `POST /appointment/payment` - Criar payment order para agendamento (autenticado)
  - Valida disponibilidade antes de criar o pagamento
  - Cria preferência de pagamento no Mercado Pago (Checkout Pro)
  - Retorna `checkoutUrl` para redirecionamento do cliente
- `POST /appointment/schedule` - Criar agendamento diretamente (legado - não recomendado)
- `GET /appointment/by-user` - Meus agendamentos (autenticado)
- `GET /appointment/by-atendent/:id` - Agendamentos do atendente (autenticado)
- `PUT /appointment/:id` - Atualizar agendamento (autenticado)

**Nota:** O agendamento é criado automaticamente após confirmação do pagamento via webhook do Mercado Pago.

---

**Última atualização:** 2024-12-19

---

## 💳 Fluxo de Pagamento Detalhado (Mercado Pago Checkout Pro)

### **Arquitetura do Fluxo de Pagamento**

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /appointment/payment
       │    { atendentServiceId, date, startTime, endTime }
       ▼
┌─────────────────────────────┐
│ CreateAppointmentPayment    │
│ OrderUseCase                │
│ - Valida atendentService    │
│ - Valida data (não passado) │
│ - Valida disponibilidade    │
└──────┬──────────────────────┘
       │
       │ 2. Cria preferência no Mercado Pago
       │    - Cria PaymentOrder
       │    - amount: preço do serviço
       │    - description: JSON com metadados
       │    - productType: "appointment"
       │    - externalId: preference_id do Mercado Pago
       ▼
┌─────────────────────────────┐
│   PaymentOrder (pending)    │
│   + checkoutUrl (Mercado    │
│     Pago Checkout Pro)      │
└──────┬──────────────────────┘
       │
       │ 3. Frontend redireciona cliente
       │    para checkoutUrl
       ▼
┌─────────────────────────────┐
│   Mercado Pago Checkout Pro │
│   (cliente paga no site     │
│    do Mercado Pago)         │
└──────┬──────────────────────┘
       │
       │ 4. Webhook: payment (tipo de evento)
       │    - Mercado Pago envia payment_id
       ▼
┌─────────────────────────────┐
│ MercadoPagoPaymentSucceeded │
│ UseCase                     │
│ - Busca pagamento no MP      │
│ - Identifica preference_id  │
│ - Busca PaymentOrder         │
│ - Atualiza status = completed│
│ - Publica evento             │
└──────┬──────────────────────┘
       │
       │ 5. Event: PaymentOrderSucceed
       ▼
┌─────────────────────────────┐
│ PaymentOrderCompleted       │
│ Factory                     │
│ - Identifica productType    │
│ - Retorna ProcessAppointment│
│   PaymentUseCase            │
└──────┬──────────────────────┘
       │
       │ 6. ProcessAppointmentPaymentUseCase
       │    - Valida pagamento completed
       │    - Verifica idempotência
       │    - Extrai metadados
       │    - Valida disponibilidade (2ª vez)
       ▼
┌─────────────────────────────┐
│ CreateAppointmentAfter      │
│ PaymentUseCase             │
│ - Valida tudo novamente     │
│ - Cria Appointment          │
└──────┬──────────────────────┘
       │
       │ 7. Appointment criado
       ▼
┌─────────────────────────────┐
│      Appointment            │
│   (status: scheduled)       │
│   paymentOrderId: "xxx"     │
└─────────────────────────────┘
```

### **Metadados Armazenados no PaymentOrder**

O campo `description` do `PaymentOrder` armazena um JSON com os metadados do agendamento:

```json
{
  "atendentServiceId": "atendent_service_id",
  "userId": "user_id",
  "date": "2024-01-15T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "10:30"
}
```

**Nota:** No futuro, isso pode ser substituído por um campo `metadata` dedicado no `PaymentOrderEntity`.

### **Tratamento de Erros**

- **Pagamento falha**: `PaymentOrder.status = "failed"`, nenhum agendamento é criado
- **Horário ocupado entre validações**: Segunda validação detecta e retorna erro
- **Webhook duplicado**: Idempotência garante que não cria appointment duplicado
- **Metadados inválidos**: Erro retornado, pagamento fica como completed mas sem appointment

### **Configuração do Mercado Pago**

Para utilizar o sistema de pagamento, é necessário configurar as seguintes variáveis de ambiente:

```env
# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui

# URLs de retorno após pagamento
MERCADO_PAGO_SUCCESS_URL=https://seu-site.com/pagamento/sucesso
MERCADO_PAGO_FAILURE_URL=https://seu-site.com/pagamento/falha
MERCADO_PAGO_PENDING_URL=https://seu-site.com/pagamento/pendente

# URL do webhook (deve ser acessível publicamente)
MERCADO_PAGO_WEBHOOK_URL=https://seu-backend.com/webhooks/mercado-pago
```

**Importante:**

- O webhook deve ser configurado no painel do Mercado Pago apontando para `/webhooks/mercado-pago`
- As URLs de retorno devem ser configuradas no frontend para redirecionar o cliente após o pagamento
- O `externalId` do `PaymentOrder` armazena o `preference_id` do Mercado Pago
- O webhook do Mercado Pago envia o `payment_id`, que é usado para buscar a preferência associada
