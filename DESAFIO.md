# Desafio de Elegibilidade — Guia do Candidato

Bem-vindo(a)! Este guia é o seu roteiro para resolver o desafio. Leia com atenção antes de começar a codar.

**Tempo sugerido: 30 minutos** (20-25 min de implementação + 5-10 min para testes e revisão).

---

## 1. O cenário

Você está evoluindo uma pequena aplicação já existente que verifica se um paciente pode seguir para **atendimento domiciliar**.

O backend e o frontend já estão praticamente prontos. Faltam **duas implementações** para o fluxo funcionar de ponta a ponta.

## 2. Regra de negócio

Um paciente é **elegível** para atendimento domiciliar somente quando:

1. está **ativo** (`active: true`);
2. possui **documento válido** (`hasValidDocument: true`);
3. possui **pelo menos um exame** (`exams.length > 0`);
4. **todos** os exames selecionados são elegíveis para atendimento domiciliar (`exam.homeCareEligible: true` para todos).

Se qualquer regra falhar, o paciente é **não elegível**, e a API deve retornar os motivos (pode haver mais de um):

- `INACTIVE_PATIENT`
- `INVALID_DOCUMENT`
- `NO_EXAMS`
- `EXAM_NOT_ELIGIBLE`

## 3. O que você precisa implementar

Existem **apenas dois arquivos** com `TODO` no projeto. Não é necessário (nem esperado) alterar mais nada.

### 3.1 Backend

```text
apps/api/src/services/eligibility.service.ts
```

Implemente o método `execute` para aplicar a regra de negócio descrita acima e retornar um `EligibilityResult`:

```ts
export interface EligibilityResult {
  patientId: string;
  eligible: boolean;
  reasons: EligibilityReason[];
}
```

Dica: o paciente já é buscado pelo repository e o erro `404` para paciente inexistente já está tratado. Foque apenas na regra de elegibilidade.

### 3.2 Frontend

```text
apps/web/src/components/EligibilityCard.tsx
```

Implemente o comportamento do componente ao clicar em **"Verificar elegibilidade"**:

- **Estado inicial**: botão habilitado com o texto "Verificar elegibilidade".
- **Loading**: ao clicar, desabilitar o botão e exibir "Verificando elegibilidade...".
- **Sucesso — elegível**: exibir "Paciente elegível para atendimento domiciliar.".
- **Sucesso — não elegível**: exibir "Paciente não elegível para atendimento domiciliar." (opcionalmente, você pode listar os `reasons`).
- **Erro**: exibir "Não foi possível verificar a elegibilidade.".

O serviço HTTP (`services/eligibility-api.ts`) já está pronto — use a função `getEligibility(patientId)`.

> Dica de acessibilidade: use `aria-live="polite"` na região que exibe o status assíncrono. Não é obrigatório, mas conta pontos.

## 4. Rodando o projeto

```bash
npm install
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3001>

Não é necessário Docker, banco de dados ou qualquer serviço externo.

## 5. Testando sua implementação

```bash
npm test
```

Isso roda os testes de backend e frontend. Um teste de exemplo já está pronto em cada camada, mostrando o formato esperado. Sinta-se à vontade para adicionar mais testes cobrindo os cenários de borda.

Você também pode validar manualmente via `curl`:

```bash
curl http://localhost:3001/api/patients/patient-001/eligibility
curl http://localhost:3001/api/patients/patient-002/eligibility
curl http://localhost:3001/api/patients/patient-003/eligibility
curl http://localhost:3001/api/patients/patient-004/eligibility
curl http://localhost:3001/api/patients/unknown/eligibility
```

## 6. Dados fictícios disponíveis

O repository em memória já contém 4 pacientes fictícios (`patient-001` a `patient-004`), cada um cobrindo um cenário diferente da regra de negócio. Você pode consultá-los em:

```text
apps/api/src/repositories/patient.repository.ts
```

Use-os para validar manualmente sua implementação enquanto desenvolve.

## 7. Checklist antes de encerrar

- [ ] `npm run typecheck` passa sem erros;
- [ ] `npm test` passa (ou você sabe explicar o que falta e por quê);
- [ ] os 4 cenários de paciente + paciente inexistente retornam o resultado esperado;
- [ ] o frontend mostra loading, sucesso (elegível/não elegível) e erro corretamente;
- [ ] você está preparado para explicar as decisões tomadas.

## 8. O que será avaliado

Não se preocupe em decorar a rubrica — de forma resumida, avaliamos:

- correção da regra de negócio;
- qualidade e organização do código (TypeScript, sem `any`, sem hardcode desnecessário);
- tratamento de estados assíncronos e erros no frontend;
- testes;
- sua capacidade de explicar o raciocínio e as decisões técnicas ao final.

## 9. Dicas finais

- Não é necessário criar Express, rotas, repository ou configurar testes — tudo isso já está pronto.
- Evite abstrações desnecessárias: a solução esperada é simples e direta.
- Se tiver dúvidas sobre requisitos, declare as suposições que você fez e siga em frente.
- Ao terminar, esteja pronto para conversar sobre trade-offs, cenários de borda e como essa solução evoluiria em um cenário de produção real.

Boa sorte! 🚀
