async function carregar() {
  const resposta = await fetch('/api/tarefas');
  const { tarefas, resumo } = await resposta.json();
  document.getElementById('resumo').textContent =
    `${resumo.concluidas} de ${resumo.total} concluídas (${resumo.percentual}%)`;
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  tarefas.forEach((t) => {
    const item = document.createElement('li');
    item.textContent = `${t.titulo} [${t.prioridade}]`;
    if (t.concluida) item.className = 'concluida';
    item.onclick = async () => {
      await fetch(`/api/tarefas/${t.id}/concluir`, { method: 'PATCH' });
      carregar();
    };
    lista.appendChild(item);
  });
}

document.getElementById('form').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: document.getElementById('titulo').value,
      prioridade: document.getElementById('prioridade').value,
    }),
  });
  document.getElementById('titulo').value = '';
  carregar();
});

carregar();
