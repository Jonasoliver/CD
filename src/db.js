const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://app:app@localhost:5432/app',
});

async function migrar() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(100) NOT NULL,
      prioridade VARCHAR(10) NOT NULL DEFAULT 'media',
      concluida BOOLEAN NOT NULL DEFAULT FALSE,
      criada_em TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

module.exports = { pool, migrar };
