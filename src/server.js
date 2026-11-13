const app = require('./app');
const { migrar } = require('./db');

const PORTA = process.env.PORT || 3000;

migrar()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`Servidor rodando na porta ${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error('Falha ao iniciar:', erro.message);
    process.exit(1);
  });
