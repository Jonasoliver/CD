// Testes de integração: API HTTP + banco PostgreSQL real
const request = require('supertest');
const app = require('../../src/app');
const { pool, migrar } = require('../../src/db');

beforeAll(async () => {
  await migrar();
});

beforeEach(async () => {
  await pool.query('TRUNCATE tarefas RESTART IDENTITY');
});

afterAll(async () => {
  await pool.end();
});

describe('API de tarefas', () => {
  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('POST /api/tarefas grava no banco', async () => {
    const res = await request(app).post('/api/tarefas').send({ titulo: 'Configurar pipeline' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, titulo: 'Configurar pipeline', prioridade: 'media' });

    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM tarefas');
    expect(rows[0].n).toBe(1);
  });

  test('POST /api/tarefas recusa dados inválidos com 400', async () => {
    const res = await request(app).post('/api/tarefas').send({ titulo: '' });
    expect(res.status).toBe(400);
    expect(res.body.erros.length).toBeGreaterThan(0);
  });

  test('fluxo completo: criar, concluir e resumir', async () => {
    await request(app).post('/api/tarefas').send({ titulo: 'A' });
    await request(app).post('/api/tarefas').send({ titulo: 'B', prioridade: 'alta' });
    await request(app).patch('/api/tarefas/1/concluir');

    const res = await request(app).get('/api/tarefas');
    expect(res.status).toBe(200);
    expect(res.body.tarefas).toHaveLength(2);
    expect(res.body.resumo).toEqual({ total: 2, concluidas: 1, pendentes: 1, percentual: 50 });
  });

  test('PATCH em tarefa inexistente retorna 404', async () => {
    const res = await request(app).patch('/api/tarefas/999/concluir');
    expect(res.status).toBe(404);
  });

  test('DELETE remove a tarefa do banco', async () => {
    await request(app).post('/api/tarefas').send({ titulo: 'Apagar' });
    const res = await request(app).delete('/api/tarefas/1');
    expect(res.status).toBe(204);
    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM tarefas');
    expect(rows[0].n).toBe(0);
  });
});
