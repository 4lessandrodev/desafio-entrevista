# Desafio Técnico Fullstack Pleno

Tempo sugerido: 30 minutos.

## Stack

- Node.js
- TypeScript
- Express
- React
- Vite

## Rodando

```bash
npm install
npm run dev
```

Frontend: <http://localhost:5173>

Backend: <http://localhost:3001>

## Testes

```bash
npm test
```

## Objetivo

Complete os TODOs existentes no projeto.

Um paciente é elegível para atendimento domiciliar somente quando:

1. está ativo;
2. possui documento válido;
3. possui pelo menos um exame;
4. todos os exames são elegíveis para atendimento domiciliar.

Motivos possíveis:

- `INACTIVE_PATIENT`
- `INVALID_DOCUMENT`
- `NO_EXAMS`
- `EXAM_NOT_ELIGIBLE`

Endpoint:

```http
GET /api/patients/:patientId/eligibility
```

## Frontend

Ao clicar em **Verificar elegibilidade**:

- apresentar loading;
- consumir a API;
- mostrar resultado;
- tratar erro.

Caso tenha tempo, adicione ou melhore testes.

Ao finalizar, esteja preparado para explicar as decisões tomadas.

Obrigado!
