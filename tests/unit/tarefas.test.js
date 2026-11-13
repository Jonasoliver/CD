const { validarTarefa, normalizarTarefa, resumir } = require('../../src/tarefas');

describe('validarTarefa', () => {
  test('aceita uma tarefa válida', () => {
    expect(validarTarefa({ titulo: 'Estudar CI', prioridade: 'alta' })).toEqual({
      valido: true,
      erros: [],
    });
  });

  test('rejeita título vazio', () => {
    const r = validarTarefa({ titulo: '   ' });
    expect(r.valido).toBe(false);
    expect(r.erros).toContain('O título é obrigatório.');
  });

  test('rejeita título com mais de 100 caracteres', () => {
    expect(validarTarefa({ titulo: 'a'.repeat(101) }).valido).toBe(false);
  });

  test('rejeita prioridade inexistente', () => {
    expect(validarTarefa({ titulo: 'Teste', prioridade: 'urgente' }).valido).toBe(false);
  });

  test('rejeita corpo ausente', () => {
    expect(validarTarefa(undefined).valido).toBe(false);
  });
});

describe('normalizarTarefa', () => {
  test('remove espaços e aplica prioridade padrão', () => {
    expect(normalizarTarefa({ titulo: '  Ler  ' })).toEqual({ titulo: 'Ler', prioridade: 'media' });
  });
});

describe('resumir', () => {
  test('calcula totais e percentual', () => {
    const tarefas = [
      { concluida: true },
      { concluida: false },
      { concluida: true },
      { concluida: false },
    ];
    expect(resumir(tarefas)).toEqual({ total: 4, concluidas: 2, pendentes: 2, percentual: 50 });
  });

  test('lista vazia retorna 0%', () => {
    expect(resumir([]).percentual).toBe(0);
  });
});
