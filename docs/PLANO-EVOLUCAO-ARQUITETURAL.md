# Plano de Evolução — Aluguel Imóveis App

Documento de referência para transformar a avaliação arquitetural em issues e PRs pequenos, revisáveis e independentes.

> Escopo atual: backend Node.js/Express, frontend React/Vite, persistência em arquivos JSON e integrações de geocodificação/risco de enchente.

## Objetivos

- Separar HTTP, regras de negócio e persistência.
- Tornar o cálculo de ranking determinístico, testável e configurável.
- Evitar perda/corrupção de dados na persistência.
- Padronizar validação, erros, configurações e chamadas de API.
- Evoluir a interface sem concentrar lógica em páginas grandes.

## Ordem recomendada

1. Testes e linha de base do comportamento atual.
2. Middleware de erros e validação de entrada.
3. Repository para encapsular os JSONs.
4. Refatoração de imóveis e scoring.
5. Refatoração de gastos/cartões e remoção de acoplamento entre rotas.
6. Persistência SQLite/PostgreSQL.
7. Organização do frontend e serviço HTTP centralizado.
8. Observabilidade, documentação e CI.

---

## Backlog de issues

### #1 — Criar baseline de testes para o domínio de imóveis e scoring

**Tipo:** `task`  
**Prioridade:** P0  
**PR sugerido:** `test: criar baseline do domínio de imóveis`

**Descrição:**
Criar testes unitários para preservar o comportamento atual antes das refatorações.

**Escopo:**
- Cobrir `calcularScoreImovel` e funções financeiras/estruturais.
- Cobrir imóvel dentro e fora do orçamento.
- Cobrir seguro-fiança, risco de enchente, distâncias e bônus manual.
- Adicionar casos de dados incompletos e valores inválidos.
- Documentar arredondamentos e pesos do score.

**Critérios de aceite:**
- Testes executáveis por comando npm.
- Cenários principais cobertos.
- Nenhuma mudança funcional não documentada.

---

### #2 — Adicionar middleware global de erros e padrão de resposta

**Tipo:** `enhancement`  
**Prioridade:** P0  
**PR sugerido:** `refactor: padronizar tratamento de erros da API`

**Descrição:**
Centralizar tratamento de exceções do Express e evitar mensagens internas sendo expostas diretamente ao cliente.

**Escopo:**
- Criar `backend/src/middleware/errorHandler.js`.
- Criar erros de domínio com `statusCode`.
- Usar `next(error)` nas rotas assíncronas.
- Adicionar 404 para endpoints inexistentes.
- Padronizar resposta, por exemplo `{ error: { code, message, details } }`.

**Critérios de aceite:**
- Erros inesperados retornam HTTP 500 sem stack trace em produção.
- Erros de validação retornam HTTP 400.
- Rotas deixam de duplicar tratamento de erro.

---

### #3 — Validar payloads da API

**Tipo:** `enhancement`  
**Prioridade:** P0  
**PR sugerido:** `feat: validar entradas da API`

**Descrição:**
Impedir que payloads incompletos ou inválidos alterem os arquivos de dados ou o banco.

**Escopo:**
- Definir schemas para imóveis, gastos, renda e pagamentos.
- Validar números não negativos, campos obrigatórios e enumerações.
- Rejeitar campos desconhecidos quando apropriado.
- Validar `:id`, `:pessoa` e `:mesAno`.
- Retornar erros consistentes.

**Critérios de aceite:**
- Payload inválido não é persistido.
- Testes de validação cobrem sucesso e falha.

---

### #4 — Criar camada de Repository para a persistência atual

**Tipo:** `refactor`  
**Prioridade:** P0  
**PR sugerido:** `refactor: encapsular persistencia em repositories`

**Descrição:**
Remover acesso direto a `fs` das rotas e criar uma abstração que permita trocar JSON por banco sem reescrever o domínio.

**Estrutura sugerida:**
- `backend/src/repositories/jsonRepository.js`
- `imovelRepository.js`
- `gastosRepository.js`
- `rendaRepository.js`
- `historicoRepository.js`

**Escopo:**
- Centralizar leitura, escrita e tratamento de arquivo inexistente.
- Usar escrita atômica com arquivo temporário + rename.
- Evitar helpers duplicados de `lerJSON`/`salvarJSON`.
- Manter a API externa inalterada.

**Critérios de aceite:**
- Rotas não importam `fs` nem conhecem caminhos de dados.
- Testes dos repositories cobrem arquivo ausente, JSON inválido e escrita.

---

### #5 — Extrair `imovelService` das rotas de imóveis

**Tipo:** `refactor`  
**Prioridade:** P0  
**PR sugerido:** `refactor: extrair casos de uso de imoveis`

**Descrição:**
Mover criação, atualização, ranking e reavaliação de imóveis de `backend/src/routes/imoveis.js` para serviços/casos de uso.

**Escopo:**
- Criar casos de uso `listarImoveis`, `buscarImovel`, `criarImovel`, `atualizarImovel`, `removerImovel` e `reavaliarImovel`.
- Deixar a rota responsável somente por HTTP.
- Injetar repository, geocoding e scoring nos serviços.
- Corrigir respostas de DELETE para informar quando o ID não existe.

**Critérios de aceite:**
- `routes/imoveis.js` fica fina.
- Casos de uso podem ser testados sem iniciar o Express.

---

### #6 — Separar o motor de scoring em módulos de domínio

**Tipo:** `refactor`  
**Prioridade:** P1  
**PR sugerido:** `refactor: modularizar motor de ranking`

**Descrição:**
Dividir `backend/src/services/score.js`, que atualmente lê arquivos e calcula várias dimensões do domínio.

**Estrutura sugerida:**
- `domain/scoring/financialScore.js`
- `domain/scoring/mobilityScore.js`
- `domain/scoring/structuralScore.js`
- `domain/scoring/scorePolicy.js`
- `services/scoringService.js`

**Escopo:**
- Remover I/O de arquivos do cálculo puro.
- Passar finanças e configuração como dependências/argumentos.
- Centralizar pesos, penalidades e arredondamentos.
- Retornar breakdown explicável do score.

**Critérios de aceite:**
- Funções puras para cada dimensão.
- Score final continua compatível com o baseline, salvo alterações aprovadas.
- O frontend consegue exibir como o score foi formado.

---

### #7 — Desacoplar gastos e cartões

**Tipo:** `refactor`  
**Prioridade:** P1  
**PR sugerido:** `refactor: extrair sincronizacao financeira para service`

**Descrição:**
Eliminar a dependência da rota `gastos.js` em `cartoes.js` e retirar efeitos colaterais de operações GET.

**Escopo:**
- Criar `services/sincronizacaoFinanceiraService.js`.
- Mover inicialização/sincronização do histórico para service próprio.
- Tornar GET somente leitura.
- Criar endpoint explícito de sincronização quando necessário.
- Garantir idempotência da sincronização.

**Critérios de aceite:**
- Nenhuma rota importa outra rota.
- GET não grava dados silenciosamente.
- Testes cobrem sincronização repetida e contas pagas.

---

### #8 — Centralizar configuração e variáveis de ambiente

**Tipo:** `enhancement`  
**Prioridade:** P1  
**PR sugerido:** `feat: centralizar configuracao do backend`

**Descrição:**
Separar configurações operacionais de regras de negócio e eliminar defaults silenciosos perigosos, como renda fixa fallback.

**Escopo:**
- Criar `backend/src/config/index.js`.
- Validar `PORT`, `NODE_ENV`, URL do frontend, timeout e User-Agent do Nominatim.
- Definir política clara para orçamento e regras de score.
- Manter regras de score versionadas/configuráveis, sem esconder valores no código.
- Criar `.env.example` e atualizar README.

**Critérios de aceite:**
- Aplicação falha cedo quando configuração obrigatória está inválida.
- Nenhum segredo é commitado.
- Configuração usada pelo score é explícita e testável.

---

### #9 — Migrar persistência JSON para SQLite inicialmente

**Tipo:** `enhancement`  
**Prioridade:** P1  
**PR sugerido:** `feat: migrar persistencia para sqlite`

**Descrição:**
Substituir arquivos JSON por SQLite como etapa segura antes de avaliar PostgreSQL. Para uma aplicação local, SQLite reduz complexidade operacional e já fornece transações, integridade e consultas.

**Escopo:**
- Definir schema para imóveis, gastos, renda, cartões, histórico e avaliações.
- Criar migrations e script de seed/importação dos JSONs.
- Implementar repositories SQLite mantendo os contratos da issue #4.
- Usar transações para atualizações relacionadas.
- Criar backup/exportação.

**Critérios de aceite:**
- Importação reproduz os dados existentes.
- Operações de escrita são transacionais.
- Existe procedimento de rollback/exportação.

**Evolução posterior:**
Se houver múltiplos usuários, deploy distribuído ou crescimento relevante, avaliar PostgreSQL com a mesma interface de repository.

---

### #10 — Criar cliente HTTP centralizado no frontend

**Tipo:** `refactor`  
**Prioridade:** P1  
**PR sugerido:** `refactor: centralizar cliente e modulos de API`

**Descrição:**
Remover URLs e configuração repetidas das páginas React.

**Escopo:**
- Criar `frontend/src/services/api.js` com `axios.create`.
- Usar `VITE_API_BASE_URL`.
- Criar módulos `imoveisApi`, `gastosApi`, `cartoesApi`, `agendaApi`, `mercadoApi` e `metasApi`.
- Padronizar loading, erro e cancelamento de requests.

**Critérios de aceite:**
- Páginas não montam URLs manualmente.
- Ambiente local e produção podem usar bases diferentes.
- Erros da API têm tratamento consistente.

---

### #11 — Dividir páginas React grandes e extrair hooks

**Tipo:** `refactor`  
**Prioridade:** P2  
**PR sugerido:** `refactor: decompor paginas e hooks do frontend`

**Descrição:**
Reduzir a concentração de UI, estado e regras nas páginas como `DetalhesImovel.jsx`, `Dashboard.jsx` e `Cartoes.jsx`.

**Escopo:**
- Extrair componentes por domínio: financeiro, geográfico, avaliação e score.
- Criar hooks `useImoveis`, `useGastos`, `useCartoes` e `useMetas`.
- Manter páginas como composição/orquestração.
- Evitar duplicação de formatação monetária e estados de formulário.

**Critérios de aceite:**
- Componentes menores e com responsabilidades claras.
- Fluxos existentes continuam funcionando.
- Lógica de dados pode ser testada fora da renderização.

---

### #12 — Padronizar rotas, documentação OpenAPI e healthcheck

**Tipo:** `documentation`  
**Prioridade:** P2  
**PR sugerido:** `docs: documentar contrato da API`

**Descrição:**
Documentar contratos da API e alinhar convenções de nomes, status HTTP e recursos.

**Escopo:**
- Criar OpenAPI para imóveis, gastos, renda, cartões, agenda, mercado e metas.
- Documentar payloads, respostas e erros.
- Revisar endpoints customizados como `/reavaliar` e `/marcar-pago`.
- Separar healthcheck de readiness quando houver banco/integrações.

**Critérios de aceite:**
- Swagger/OpenAPI atualizado no repositório.
- Exemplos de request/response disponíveis.
- Status HTTP esperados documentados.

---

### #13 — Adicionar CI, lint consistente e testes de integração

**Tipo:** `task`  
**Prioridade:** P2  
**PR sugerido:** `ci: configurar qualidade automatica`

**Escopo:**
- Workflow para instalar backend/frontend com lockfile.
- Rodar lint, testes unitários e build do frontend.
- Adicionar testes de integração da API com banco temporário.
- Configurar Node.js suportado e impedir regressões em PR.

**Critérios de aceite:**
- PR sem checks verdes não pode ser considerado pronto.
- Comandos de CI estão documentados no README.

---

## Sugestão de PRs

| PR | Issue | Objetivo | Dependências |
|---|---|---|---|
| 1 | #1 | Baseline de testes | Nenhuma |
| 2 | #2 | Erros globais | #1 recomendado |
| 3 | #3 | Validação de payloads | #2 |
| 4 | #4 | Repositories JSON | #1 |
| 5 | #5 | Serviço de imóveis | #4 |
| 6 | #6 | Scoring modular | #1, #4 |
| 7 | #7 | Gastos/cartões desacoplados | #4 |
| 8 | #8 | Configuração centralizada | #6 |
| 9 | #9 | SQLite e migração | #4, #7 |
| 10 | #10 | Cliente HTTP frontend | Nenhuma |
| 11 | #11 | Componentes/hooks frontend | #10 |
| 12 | #12 | OpenAPI e contratos | #2, #3 |
| 13 | #13 | CI e integração | #1, #10 |

## Checklist para cada PR

- [ ] Escopo limitado a uma issue.
- [ ] Comportamento atual preservado ou mudança descrita.
- [ ] Testes adicionados/atualizados.
- [ ] Validação de erros e entradas incluída.
- [ ] Nenhum acesso direto a `fs` fora de repositories.
- [ ] Nenhuma rota importa outra rota.
- [ ] Nenhum segredo ou `.env` real commitado.
- [ ] README/documentação atualizados quando necessário.
- [ ] Build e lint executados localmente.

## Critérios arquiteturais de longo prazo

- Routes lidam com HTTP; services orquestram casos de uso; domínio calcula regras; repositories persistem dados.
- Integrações externas têm timeout, tratamento de erro, cache quando adequado e User-Agent identificável.
- Operações que alteram dados usam transação ou escrita atômica.
- Score é explicável, determinístico e coberto por testes.
- Frontend usa cliente API/hook por domínio e mantém páginas focadas em composição.
