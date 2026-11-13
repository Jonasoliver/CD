// Regras de negócio puras (alvo dos testes unitários)

const PRIORIDADES = ['baixa', 'media', 'alta'];

function validarTarefa(dados) {
  const erros = [];
  if (!dados || typeof dados.titulo !== 'string' || dados.titulo.trim() === '') {
    erros.push('O título é obrigatório.');
  } else if (dados.titulo.trim().length > 100) {
    erros.push('O título deve ter no máximo 100 caracteres.');
  }
  if (dados && dados.prioridade !== undefined && !PRIORIDADES.includes(dados.prioridade)) {
    erros.push(`Prioridade inválida. Use: ${PRIORIDADES.join(', ')}.`);
  }
  return { valido: erros.length === 0, erros };
}

function normalizarTarefa(dados) {
  return {
    titulo: dados.titulo.trim(),
    prioridade: dados.prioridade ?? 'media',
  };
}

function resumir(tarefas) {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);
  return { total, concluidas, pendentes: total - concluidas, percentual };
}

module.exports = { PRIORIDADES, validarTarefa, normalizarTarefa, resumir };
