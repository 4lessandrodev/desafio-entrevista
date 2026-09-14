# Rubrica de Avaliação

Pontuação total: **100 pontos**. A pontuação apoia, mas não substitui, o
julgamento técnico do entrevistador.

## Backend — 30 pontos

| Critério | Pontos |
|---|---:|
| Regra de negócio correta | 10 |
| Organização e legibilidade | 6 |
| Uso adequado de TypeScript | 5 |
| Tratamento de erro e 404 | 5 |
| Separação de responsabilidades | 4 |

## React — 25 pontos

| Critério | Pontos |
|---|---:|
| Chamada da API | 6 |
| Estado e fluxo assíncrono | 6 |
| Loading | 3 |
| Erro | 4 |
| Organização | 3 |
| Acessibilidade | 3 |

## Qualidade e confiabilidade — 15 pontos

Avalie cenários de borda, ausência de `any`, ausência de hardcode indevido,
comportamento previsível e código defensivo na medida certa.

## Testes — 10 pontos

Avalie a qualidade do cenário escolhido, se o teste é funcional e se observa
comportamento em vez de detalhes de implementação.

## Raciocínio e comunicação — 20 pontos

Observe se o candidato entende antes de codificar, navega com autonomia,
explica decisões, reconhece trade-offs, diferencia uma solução de desafio de
uma solução de produção e identifica riscos.

## Faixas de resultado

| Pontuação | Interpretação |
|---:|---|
| 85–100 | Forte aderência para Pleno |
| 70–84 | Aderência para Pleno |
| 55–69 | Limítrofe; aprofundar na entrevista |
| abaixo de 55 | Abaixo do esperado para Pleno |

## Perguntas para discussão

### 1. Se essa API recebesse milhares de chamadas por minuto, o que você observaria?

Sinais esperados incluem latência, throughput, taxa de erro, CPU, memória,
dependências, timeout, logs, métricas, traces e, quando adequado, cache.

### 2. Se a elegibilidade dependesse de outro sistema e esse sistema estivesse indisponível, você retornaria `eligible: false`?

Um bom sinal é diferenciar "não elegível" de "não foi possível determinar a
elegibilidade" e propor um comportamento explícito para indisponibilidade.

### 3. O que mudaria se fossem dados reais de pacientes?

Procure autenticação, autorização, LGPD, mascaramento, proteção de logs,
auditoria, rastreabilidade e segurança.

### 4. Onde colocaria a regra caso três endpoints diferentes precisassem utilizá-la?

Espera-se extrair ou manter a regra em um serviço/domínio reutilizável,
independente do transporte HTTP e sem duplicação.
