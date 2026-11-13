# CI com GitHub Actions — Aplicação Web

Aplicação web de exemplo (lista de tarefas em Node.js + Express + PostgreSQL) usada para demonstrar
um pipeline de Integração Contínua com GitHub Actions.

## Pipeline (`.github/workflows/ci.yml`)

```
Pull Request
  -> [ Análise estática de código | Análise de formatação | Análise estática de segurança ]
  -> Build -> Testes unitários -> Testes de integração -> Imagem Docker
```

| Etapa             | Ferramenta                                        |
| ----------------- | ------------------------------------------------- |
| Gatilho           | `pull_request` para `main`                        |
| Análise estática  | ESLint                                            |
| Formatação        | Prettier                                          |
| Segurança (SAST)  | Semgrep + npm audit                               |
| Build             | esbuild (gera `dist/`)                            |
| Testes unitários  | Jest                                              |
| Testes integração | Jest + Supertest + PostgreSQL (service container) |
| Imagem            | Docker, publicada no GitHub Container Registry    |

## API REST

| Método | Rota                       | Descrição                       |
| ------ | -------------------------- | ------------------------------- |
| GET    | /health                    | Verificação de saúde            |
| GET    | /api/tarefas               | Lista as tarefas e o resumo     |
| GET    | /api/tarefas/busca?q=texto | Busca tarefas pelo título       |
| POST   | /api/tarefas               | Cria uma tarefa                 |
| PATCH  | /api/tarefas/:id/concluir  | Marca uma tarefa como concluída |
| DELETE | /api/tarefas/:id           | Remove uma tarefa               |

## Rodando localmente

```bash
npm ci
npm run lint && npm run format:check
npm run build
npm run test:unit
DATABASE_URL=postgresql://app:app@localhost:5432/app_test npm run test:integration
docker build -t ci-github-actions .
```
