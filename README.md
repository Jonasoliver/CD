# CI com GitHub Actions — Aplicação Web

Aplicação web de exemplo (lista de tarefas em Node.js + Express + PostgreSQL) usada para demonstrar
um pipeline de Integração Contínua com GitHub Actions.

## Pipeline (`.github/workflows/ci.yml`)

```
Pull Request -> Análise estática e formatação -> Build -> Testes unitários e de integração -> Imagem Docker
```

| Etapa             | Ferramenta                                        |
| ----------------- | ------------------------------------------------- |
| Gatilho           | `pull_request` para `main`                        |
| Análise estática  | ESLint                                            |
| Formatação        | Prettier                                          |
| Build             | esbuild (gera `dist/`)                            |
| Testes unitários  | Jest                                              |
| Testes integração | Jest + Supertest + PostgreSQL (service container) |
| Imagem            | Docker, publicada no GitHub Container Registry    |

## Rodando localmente

```bash
npm ci
npm run lint && npm run format:check
npm run build
npm run test:unit
DATABASE_URL=postgresql://app:app@localhost:5432/app_test npm run test:integration
docker build -t ci-github-actions .
```
