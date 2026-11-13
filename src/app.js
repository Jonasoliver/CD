const fs = require('fs');
const path = require('path');
const express = require('express');
const { pool } = require('./db');
const { validarTarefa, normalizarTarefa, resumir } = require('./tarefas');

const app = express();
app.use(express.json());
// Em desenvolvimento os estáticos estão em ../public; após o build, em dist/public
const pastaPublica = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '..', 'public');
app.use(express.static(pastaPublica));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tarefas', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tarefas ORDER BY id');
  res.json({ tarefas: rows, resumo: resumir(rows) });
});

app.post('/api/tarefas', async (req, res) => {
  const { valido, erros } = validarTarefa(req.body);
  if (!valido) {
    return res.status(400).json({ erros });
  }
  const { titulo, prioridade } = normalizarTarefa(req.body);
  const { rows } = await pool.query(
    'INSERT INTO tarefas (titulo, prioridade) VALUES ($1, $2) RETURNING *',
    [titulo, prioridade],
  );
  return res.status(201).json(rows[0]);
});

app.patch('/api/tarefas/:id/concluir', async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE tarefas SET concluida = TRUE WHERE id = $1 RETURNING *',
    [req.params.id],
  );
  if (rows.length === 0) {
    return res.status(404).json({ erros: ['Tarefa não encontrada.'] });
  }
  return res.json(rows[0]);
});

app.delete('/api/tarefas/:id', async (req, res) => {
  const resultado = await pool.query('DELETE FROM tarefas WHERE id = $1', [req.params.id]);
  if (resultado.rowCount == 0) {
    return res.status(404).json({ erros: ['Tarefa não encontrada.'] });
  }
  return res.status(204).send();
});

module.exports = app;
