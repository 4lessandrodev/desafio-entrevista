# AGENTS.md — Desafio Técnico Fullstack Pleno (Node.js + React)

## 1. Objetivo

Implementar um repositório de desafio técnico para avaliação de candidatos à vaga de **Desenvolvedor Fullstack Pleno**, com ênfase em **Node.js, TypeScript e React**.

O desafio deve ser executável em **no máximo 30 minutos pelo candidato**.

O repositório deve simular uma pequena evolução de uma aplicação existente, evitando um CRUD do zero. O objetivo é avaliar:

- leitura e entendimento de código existente;
- implementação de regra de negócio;
- Node.js + TypeScript;
- API REST;
- React + TypeScript;
- estados assíncronos;
- tratamento de erros;
- testes;
- acessibilidade básica;
- qualidade de código;
- capacidade de explicar decisões técnicas.

O desafio deve utilizar **dados totalmente fictícios**. Não utilizar nomes, documentos, prontuários, endpoints, domínios, credenciais ou qualquer outro dado real do Einstein.

---

# 2. Princípios obrigatórios

A implementação deve seguir estes princípios:

1. **Setup mínimo**
   - O candidato não deve perder tempo configurando ferramentas.
   - `npm install` deve ser suficiente para instalar o projeto.
   - `npm run dev` deve subir frontend e backend.
   - O projeto deve funcionar sem Docker, banco de dados, VPN ou serviços externos.

2. **Problema pequeno, mas completo**
   - O candidato deve conseguir alterar backend e frontend dentro dos 30 minutos.
   - O desafio deve permitir concluir o fluxo ponta a ponta.

3. **Sem pegadinhas**
   - Não inserir bugs obscuros.
   - Não cobrar algoritmos desconectados da rotina de desenvolvimento.
   - Não exigir conhecimento específico do Einstein.

4. **Código existente**
   - O repositório deve parecer uma pequena aplicação já existente.
   - O candidato deve implementar apenas os pontos marcados com `TODO`.

5. **Avaliação objetiva**
   - O repositório deve possuir testes automatizados suficientes para validar a solução.
   - Deve existir uma solução de referência separada do projeto distribuído ao candidato.

6. **Segurança**
   - Nenhum dado real.
   - Nenhum segredo.
   - Nenhum endpoint corporativo.
   - Nenhuma dependência de ambiente interno.

---

# 3. Stack

Utilizar:

## Backend

- Node.js 20+
- TypeScript
- Express
- Zod para validações simples, se necessário
- Vitest ou Jest
- Supertest para testes HTTP

## Frontend

- React 18+
- TypeScript
- Vite
- React Testing Library
- Vitest

## Monorepo

Utilizar `npm workspaces`.

Estrutura:

```text
fullstack-pleno-challenge/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.base.json
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── controllers/
│   │   │   │   └── eligibility.controller.ts
│   │   │   ├── services/
│   │   │   │   └── eligibility.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── patient.repository.ts
│   │   │   ├── models/
│   │   │   │   └── patient.ts
│   │   │   └── errors/
│   │   │       └── not-found.error.ts
│   │   └── tests/
│   │       └── eligibility.e2e.test.ts
│   │
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── components/
│           │   ├── EligibilityCard.tsx
│           │   └── EligibilityCard.test.tsx
│           ├── services/
│           │   └── eligibility-api.ts
│           └── types/
│               └── eligibility.ts
│
├── evaluator/
│   ├── README.md
│   ├── rubric.md
│   └── reference-solution/
│       ├── eligibility.service.ts
│       ├── EligibilityCard.tsx
│       └── eligibility-api.ts
│
└── .gitignore
```

---

# 4. Cenário de negócio

O sistema deve representar um fluxo fictício em que um paciente deseja verificar se pode seguir para atendimento domiciliar.

A aplicação possui pacientes fictícios cadastrados em memória.

A regra de negócio deve considerar:

Um paciente é elegível quando:

1. está ativo;
2. possui documento válido;
3. possui pelo menos um exame;
4. todos os exames selecionados são elegíveis para atendimento domiciliar.

Caso alguma regra não seja satisfeita, a aplicação deve indicar que o paciente não é elegível e retornar os respectivos motivos.

---

# 5. Contrato de domínio

Criar:

```ts
export type EligibilityReason =
  | 'INACTIVE_PATIENT'
  | 'INVALID_DOCUMENT'
  | 'NO_EXAMS'
  | 'EXAM_NOT_ELIGIBLE';

export interface Exam {
  code: string;
  homeCareEligible: boolean;
}

export interface Patient {
  id: string;
  active: boolean;
  hasValidDocument: boolean;
  exams: Exam[];
}

export interface EligibilityResult {
  patientId: string;
  eligible: boolean;
  reasons: EligibilityReason[];
}
```

Não utilizar `any`.

---

# 6. Dados fictícios

Criar o repository em memória com exatamente estes pacientes:

```ts
const patients: Patient[] = [
  {
    id: 'patient-001',
    active: true,
    hasValidDocument: true,
    exams: [
      { code: 'HMG', homeCareEligible: true },
      { code: 'GLI', homeCareEligible: true },
    ],
  },
  {
    id: 'patient-002',
    active: true,
    hasValidDocument: true,
    exams: [
      { code: 'HMG', homeCareEligible: true },
      { code: 'RX', homeCareEligible: false },
    ],
  },
  {
    id: 'patient-003',
    active: false,
    hasValidDocument: true,
    exams: [],
  },
  {
    id: 'patient-004',
    active: true,
    hasValidDocument: false,
    exams: [{ code: 'HMG', homeCareEligible: true }],
  },
];
```

O repository deve estar completamente implementado.

Exemplo de contrato:

```ts
export interface PatientRepository {
  findById(patientId: string): Promise<Patient | null>;
}
```

A implementação pode continuar sendo assíncrona para simular acesso real a dados.

---

# 7. Backend

## Endpoint

Implementar:

```http
GET /api/patients/:patientId/eligibility
```

## Retorno — paciente elegível

```json
{
  "patientId": "patient-001",
  "eligible": true,
  "reasons": []
}
```

## Retorno — paciente não elegível

Exemplo:

```json
{
  "patientId": "patient-002",
  "eligible": false,
  "reasons": [
    "EXAM_NOT_ELIGIBLE"
  ]
}
```

## Paciente inexistente

Status:

```http
404 Not Found
```

Body:

```json
{
  "message": "Patient not found"
}
```

---

# 8. O que deve estar pronto no backend

O candidato NÃO deve precisar:

- criar Express;
- configurar TypeScript;
- configurar rotas;
- implementar repository;
- configurar CORS;
- configurar testes;
- criar tratamento global de erro;
- criar scripts npm.

Deixar prontos:

- `app.ts`;
- `server.ts`;
- repository;
- models/types;
- controller;
- tratamento de `NotFoundError`;
- rota registrada;
- testes configurados.

---

# 9. TODO principal do backend

O arquivo:

```text
apps/api/src/services/eligibility.service.ts
```

deve estar propositalmente incompleto.

Entregar algo próximo de:

```ts
import {
  EligibilityReason,
  EligibilityResult,
  Patient,
} from '../models/patient';
import { PatientRepository } from '../repositories/patient.repository';
import { NotFoundError } from '../errors/not-found.error';

export class EligibilityService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(patientId: string): Promise<EligibilityResult> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // TODO: implementar regra de elegibilidade.

    throw new Error('Not implemented');
  }
}
```

Não deixar pistas excessivas sobre a implementação.

O candidato deve perceber sozinho a possibilidade de acumular `reasons`.

---

# 10. Regra esperada na solução de referência

A solução de referência deve ser simples.

Exemplo conceitual:

```ts
const reasons: EligibilityReason[] = [];

if (!patient.active) {
  reasons.push('INACTIVE_PATIENT');
}

if (!patient.hasValidDocument) {
  reasons.push('INVALID_DOCUMENT');
}

if (patient.exams.length === 0) {
  reasons.push('NO_EXAMS');
}

if (
  patient.exams.length > 0 &&
  patient.exams.some((exam) => !exam.homeCareEligible)
) {
  reasons.push('EXAM_NOT_ELIGIBLE');
}

return {
  patientId: patient.id,
  eligible: reasons.length === 0,
  reasons,
};
```

O agente pode utilizar outra implementação equivalente.

Não exigir `every()` especificamente.

---

# 11. Frontend

A aplicação deve iniciar exibindo os quatro pacientes fictícios como opções simples.

Exemplo:

```text
Desafio de Elegibilidade

Paciente
[ patient-001 v ]

[ Verificar elegibilidade ]
```

O candidato deve conseguir trocar o paciente por um `select`.

Não investir tempo em design sofisticado.

Utilizar HTML semântico e CSS mínimo.

---

# 12. Contrato da API no frontend

Criar:

```ts
export interface EligibilityResponse {
  patientId: string;
  eligible: boolean;
  reasons: EligibilityReason[];
}
```

O serviço HTTP deve existir, mas pode conter um pequeno TODO dependendo da dificuldade desejada.

Para manter o desafio viável em 30 minutos, deixar o serviço HTTP **pronto** e concentrar o TODO principal no componente.

Exemplo:

```ts
export async function getEligibility(
  patientId: string,
): Promise<EligibilityResponse> {
  const response = await fetch(
    `/api/patients/${patientId}/eligibility`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch eligibility');
  }

  return response.json();
}
```

Configurar proxy do Vite:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001',
  },
}
```

---

# 13. TODO principal do frontend

O arquivo:

```text
apps/web/src/components/EligibilityCard.tsx
```

deve estar incompleto.

Entregar estrutura inicial:

```tsx
import { useState } from 'react';
import { getEligibility } from '../services/eligibility-api';
import type { EligibilityResponse } from '../types/eligibility';

interface Props {
  patientId: string;
}

export function EligibilityCard({ patientId }: Props) {
  // TODO: implementar estados e integração com a API.

  return (
    <section>
      <button type="button">
        Verificar elegibilidade
      </button>
    </section>
  );
}
```

---

# 14. Comportamento esperado no frontend

## Estado inicial

```text
Verificar elegibilidade
```

## Loading

Após clicar:

```text
Verificando elegibilidade...
```

O botão deve permanecer desabilitado enquanto a requisição estiver em andamento.

## Elegível

```text
Paciente elegível para atendimento domiciliar.
```

## Não elegível

```text
Paciente não elegível para atendimento domiciliar.
```

Não exigir tradução dos códigos de `reasons`.

Pode exibi-los opcionalmente.

## Erro

```text
Não foi possível verificar a elegibilidade.
```

---

# 15. Acessibilidade mínima

A implementação inicial do projeto já deve utilizar:

- `button`;
- `label`;
- `select`;
- headings semânticos.

O candidato deve poder demonstrar conhecimento adicional usando:

```tsx
aria-live="polite"
```

para mensagens assíncronas.

Não tornar `aria-live` obrigatório para considerar a implementação funcional.

Ele deve contribuir para a pontuação de acessibilidade.

---

# 16. Testes fornecidos ao candidato

Deixar o ambiente de testes funcionando.

Criar testes públicos parcialmente implementados.

## Backend

Arquivo:

```text
apps/api/tests/eligibility.e2e.test.ts
```

Deixar pelo menos um teste pronto para mostrar o formato:

```ts
describe('GET /api/patients/:patientId/eligibility', () => {
  it('returns an eligible patient', async () => {
    const response = await request(app)
      .get('/api/patients/patient-001/eligibility');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      patientId: 'patient-001',
      eligible: true,
      reasons: [],
    });
  });
});
```

Adicionar testes escondidos ou disponíveis apenas no diretório do avaliador para:

1. `patient-001` → elegível;
2. `patient-002` → `EXAM_NOT_ELIGIBLE`;
3. `patient-003` → `INACTIVE_PATIENT` + `NO_EXAMS`;
4. `patient-004` → `INVALID_DOCUMENT`;
5. paciente inexistente → 404.

---

# 17. Teste de frontend

Deixar infraestrutura configurada.

Um teste pode ser fornecido como exemplo, mas não exigir que todos passem inicialmente.

O avaliador deve possuir casos para:

- botão inicial;
- estado loading;
- sucesso elegível;
- sucesso não elegível;
- falha da API.

Não tornar detalhes de implementação parte do teste.

Testar comportamento visível.

---

# 18. Scripts obrigatórios

Na raiz:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev -w apps/api\" \"npm run dev -w apps/web\"",
    "test": "npm run test -w apps/api && npm run test -w apps/web",
    "test:api": "npm run test -w apps/api",
    "test:web": "npm run test -w apps/web",
    "build": "npm run build -w apps/api && npm run build -w apps/web",
    "typecheck": "npm run typecheck -w apps/api && npm run typecheck -w apps/web"
  }
}
```

Instalar `concurrently` na raiz.

---

# 19. README entregue ao candidato

Criar um `README.md` curto.

Não explicar a solução.

Conteúdo mínimo:

```markdown
# Desafio Técnico Fullstack Pleno

Tempo sugerido: 30 minutos.

## Stack

- Node.js
- TypeScript
- Express
- React
- Vite

## Rodando

npm install
npm run dev

Frontend:
http://localhost:5173

Backend:
http://localhost:3001

## Testes

npm test

## Objetivo

Complete os TODOs existentes no projeto.

Um paciente é elegível para atendimento domiciliar somente quando:

1. está ativo;
2. possui documento válido;
3. possui pelo menos um exame;
4. todos os exames são elegíveis para atendimento domiciliar.

Motivos possíveis:

- INACTIVE_PATIENT
- INVALID_DOCUMENT
- NO_EXAMS
- EXAM_NOT_ELIGIBLE

Endpoint:

GET /api/patients/:patientId/eligibility

## Frontend

Ao clicar em "Verificar elegibilidade":

- apresentar loading;
- consumir a API;
- mostrar resultado;
- tratar erro.

Caso tenha tempo, adicione ou melhore testes.

Ao finalizar, esteja preparado para explicar as decisões tomadas.
```

---

# 20. Arquivos que devem conter TODO

No projeto entregue ao candidato, limitar TODOs a:

```text
apps/api/src/services/eligibility.service.ts
apps/web/src/components/EligibilityCard.tsx
```

Opcional:

```text
apps/api/tests/eligibility.e2e.test.ts
```

como atividade extra.

Não espalhar TODOs pelo projeto.

---

# 21. Solução de referência

Criar:

```text
evaluator/reference-solution/
```

Esse diretório NÃO deve ser distribuído aos candidatos.

Armazenar:

```text
eligibility.service.ts
EligibilityCard.tsx
eligibility-api.ts
```

Criar também:

```text
evaluator/reference-solution.patch
```

se for simples de gerar.

A solução deve:

- compilar;
- passar lint/typecheck;
- passar todos os testes;
- ser simples;
- não utilizar abstrações desnecessárias.

---

# 22. Rubrica do avaliador

Criar:

```text
evaluator/rubric.md
```

Pontuação total: 100.

## Backend — 30

- regra de negócio correta: 10
- organização e legibilidade: 6
- TypeScript: 5
- tratamento de erro/404: 5
- separação de responsabilidades: 4

## React — 25

- chamada da API: 6
- estado e fluxo assíncrono: 6
- loading: 3
- erro: 4
- organização: 3
- acessibilidade: 3

## Qualidade e confiabilidade — 15

- cenários de borda;
- ausência de `any`;
- ausência de hardcode;
- comportamento previsível;
- código defensivo na medida certa.

## Testes — 10

- qualidade do cenário escolhido;
- teste funcional;
- teste orientado a comportamento.

## Raciocínio e comunicação — 20

Avaliação manual:

- entende antes de codificar;
- navega pelo projeto com autonomia;
- explica decisões;
- reconhece trade-offs;
- diferencia solução do desafio de solução de produção;
- identifica riscos.

---

# 23. Faixas de resultado

Usar somente como apoio ao entrevistador:

```text
85–100 → forte aderência para Pleno
70–84  → aderência para Pleno
55–69  → limítrofe, aprofundar na entrevista
<55    → abaixo do esperado para Pleno
```

A pontuação não substitui julgamento técnico.

---

# 24. Perguntas para discussão

Adicionar ao guia do avaliador.

## Pergunta 1

> Se essa API recebesse milhares de chamadas por minuto, o que você observaria?

Esperado:

- latência;
- throughput;
- taxa de erro;
- CPU/memória;
- dependências;
- timeout;
- logs;
- métricas;
- traces;
- eventualmente cache.

Não exigir todos.

---

## Pergunta 2

> Se a elegibilidade dependesse de outro sistema e esse sistema estivesse indisponível, você retornaria `eligible: false`?

Sinal positivo:

O candidato diferencia:

```text
não elegível
```

de:

```text
não foi possível determinar a elegibilidade
```

e sugere comportamento explícito para indisponibilidade.

---

## Pergunta 3

> O que mudaria se fossem dados reais de pacientes?

Esperado:

- autenticação;
- autorização;
- LGPD;
- mascaramento;
- evitar dados sensíveis em logs;
- auditoria;
- rastreabilidade;
- segurança.

---

## Pergunta 4

> Onde colocaria a regra caso três endpoints diferentes precisassem utilizá-la?

Esperado:

- extrair para service/domain;
- evitar duplicação;
- manter regra independente do transporte HTTP.

---

# 25. Critérios de qualidade do repositório

Antes de concluir, executar:

```bash
npm install
npm run typecheck
npm run build
npm test
```

Tudo deve passar na solução de referência.

Para a versão do candidato:

- instalação deve funcionar;
- aplicação deve iniciar;
- TypeScript não deve falhar por problemas não relacionados aos TODOs;
- testes relacionados aos TODOs podem falhar;
- nenhuma outra falha pode existir.

---

# 26. Smoke test manual

Executar:

```bash
npm run dev
```

Validar:

```bash
curl http://localhost:3001/api/patients/patient-001/eligibility
curl http://localhost:3001/api/patients/patient-002/eligibility
curl http://localhost:3001/api/patients/patient-003/eligibility
curl http://localhost:3001/api/patients/patient-004/eligibility
curl http://localhost:3001/api/patients/unknown/eligibility
```

Na solução de referência, esperar respectivamente:

```json
{
  "patientId": "patient-001",
  "eligible": true,
  "reasons": []
}
```

```json
{
  "patientId": "patient-002",
  "eligible": false,
  "reasons": ["EXAM_NOT_ELIGIBLE"]
}
```

```json
{
  "patientId": "patient-003",
  "eligible": false,
  "reasons": ["INACTIVE_PATIENT", "NO_EXAMS"]
}
```

```json
{
  "patientId": "patient-004",
  "eligible": false,
  "reasons": ["INVALID_DOCUMENT"]
}
```

Para desconhecido:

```http
404
```

```json
{
  "message": "Patient not found"
}
```

---

# 27. Experiência do candidato

Ao abrir o repositório, o candidato deve conseguir:

```bash
npm install
npm run dev
```

e começar o desafio imediatamente.

A interface deve indicar claramente:

```text
Desafio de Elegibilidade
```

Possibilitar selecionar:

```text
patient-001
patient-002
patient-003
patient-004
```

e visualizar o componente incompleto.

O projeto não deve apresentar warnings ou erros irrelevantes no console.

---

# 28. O que NÃO implementar

Não adicionar:

- banco de dados;
- autenticação real;
- JWT;
- AWS;
- Docker obrigatório;
- Kubernetes;
- mensageria;
- microfrontends;
- Next.js;
- Redux;
- Zustand;
- GraphQL;
- ORM;
- observabilidade real;
- design system corporativo;
- APIs externas.

Esses itens desviam a avaliação e aumentam o tempo de setup.

Também não criar arquitetura excessivamente abstrata.

---

# 29. Sinais de overengineering a evitar no código-base

Não incluir:

- DDD completo;
- CQRS;
- event sourcing;
- repository genérico;
- dependency injection framework;
- dezenas de interfaces;
- builders/factories desnecessários;
- abstração HTTP complexa;
- design patterns apenas por demonstração.

O projeto deve ser pequeno e fácil de compreender.

---

# 30. Critérios técnicos que o desafio pretende revelar

O desenho deve permitir observar naturalmente se o candidato:

- identifica a regra central;
- separa HTTP de negócio;
- sabe manipular arrays;
- entende edge cases;
- utiliza TypeScript sem `any`;
- trabalha com Promise e `async/await`;
- implementa estado React;
- lida com loading;
- trata erro;
- consome API;
- pensa em acessibilidade;
- testa comportamento;
- comunica decisões.

---

# 31. Visão 2040 — alinhamento do desenho do desafio

O desafio deve incentivar práticas coerentes com:

## Atributos

- **ATTR-01 — Paciente-cêntrico**
  - feedback claro de estado;
  - redução de ambiguidade na experiência.

- **ATTR-02 — Confiável**
  - regra determinística;
  - tratamento explícito de erro;
  - testes;
  - rastreabilidade conceitual.

- **ATTR-03 — Humano**
  - acessibilidade;
  - mensagens compreensíveis.

- **ATTR-04 — Gerador de conhecimento**
  - documentação;
  - capacidade de explicar decisões.

- **ATTR-05 — Conectado**
  - integração frontend/backend.

## Diretrizes

- **DIR-01 — Experiência centrada no paciente**
- **DIR-02 — Segurança, excelência e eficiência**
- **DIR-05 — Soluções digitais integradas**
- **DIR-06 — Ensino, pesquisa e inovação integrados**
- **DIR-10 — Cultura e desenvolvimento contínuo**
- **DIR-11 — Governança, auditoria e compliance**

Não inserir a Visão 2040 como conhecimento obrigatório do candidato.

Ela orienta o desenho da avaliação, não deve virar uma questão de memorização institucional.

---

# 32. Definição de pronto

A implementação só está concluída quando:

- [ ] monorepo funciona com npm workspaces;
- [ ] `npm install` funciona do zero;
- [ ] `npm run dev` inicia frontend e backend;
- [ ] frontend abre sem erros;
- [ ] backend responde `/health`;
- [ ] repository em memória funciona;
- [ ] TODO do backend está isolado;
- [ ] TODO do frontend está isolado;
- [ ] README do candidato está claro;
- [ ] solução de referência existe;
- [ ] testes do avaliador cobrem regras principais;
- [ ] solução de referência passa todos os testes;
- [ ] typecheck passa;
- [ ] build passa;
- [ ] nenhuma credencial ou dado real existe;
- [ ] projeto pode ser resolvido por um desenvolvedor pleno em aproximadamente 20–25 minutos, deixando 5–10 minutos para testes e discussão.

---

# 33. Instrução final ao agente implementador

Implemente o projeto completo descrito neste arquivo.

Priorize:

1. simplicidade;
2. execução local sem dependências externas;
3. fidelidade ao desafio;
4. boa experiência para o candidato;
5. testes confiáveis;
6. separação clara entre versão distribuída ao candidato e solução do avaliador.

Antes de finalizar:

1. execute todos os comandos da seção de critérios de qualidade;
2. corrija qualquer falha;
3. faça o smoke test;
4. confirme que somente os TODOs intencionais permanecem;
5. revise o README como se você fosse o candidato recebendo o projeto pela primeira vez.

Não declare a implementação concluída enquanto `build`, `typecheck` e a solução de referência não estiverem validados.
