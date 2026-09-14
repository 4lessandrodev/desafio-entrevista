# Guia do Avaliador

> Não distribua o diretório `evaluator/` aos candidatos.

## Conteúdo

- `rubric.md`: critérios de pontuação e perguntas para discussão.
- `reference-solution/`: arquivos completos que substituem os TODOs.
- `tests/`: cenários adicionais de backend e frontend.
- `reference-solution.patch`: patch da solução completa.

## Validar a solução de referência

Faça backup dos arquivos do candidato e copie:

```bash
cp evaluator/reference-solution/eligibility.service.ts \
  apps/api/src/services/eligibility.service.ts
cp evaluator/reference-solution/EligibilityCard.tsx \
  apps/web/src/components/EligibilityCard.tsx
cp evaluator/tests/eligibility.e2e.test.ts \
  apps/api/tests/eligibility.evaluator.test.ts
cp evaluator/tests/EligibilityCard.test.tsx \
  apps/web/src/components/EligibilityCard.evaluator.test.tsx

npm test
npm run typecheck
npm run build
```

Os arquivos em `reference-solution/` preservam caminhos de importação relativos
ao destino indicado acima e não devem ser compilados diretamente no diretório
do avaliador.

## Resultado esperado

| Paciente | Status | Resultado |
|---|---:|---|
| `patient-001` | 200 | elegível, sem motivos |
| `patient-002` | 200 | `EXAM_NOT_ELIGIBLE` |
| `patient-003` | 200 | `INACTIVE_PATIENT`, `NO_EXAMS` |
| `patient-004` | 200 | `INVALID_DOCUMENT` |
| `unknown` | 404 | `Patient not found` |
