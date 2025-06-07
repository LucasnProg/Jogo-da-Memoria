interface Partida {
  tag_jogador: string,
  nome_jogador: string,
  dificuldade: string,
  modo: string,
  duracao: string,
  pontuacao: number,
  data: string,
  hora: string
}

async function buscarPartidas(): Promise<Partida[]> {
  try {
    const response = await fetch('/ranking');
    if (!response.ok) throw new Error('Erro ao buscar partidas');
    const partidas: Partida[] = await response.json();
    return partidas;
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    return [];
  }
}

function criarTabela(titulo: string, partidasModo: Partida[]): HTMLElement {
  const container = document.createElement('div');
  container.className = 'tabela-container';

  const tituloElem = document.createElement('h3');
  tituloElem.textContent = titulo;
  container.appendChild(tituloElem);

  const tabela = document.createElement('table');
  tabela.className = 'table table-light table-striped table-bordered';
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Tag</th>
        <th>Jogador</th>
        <th>Pontuação</th>
        <th>Dificuldade</th>
        <th>Modo</th>
        <th>Duração</th>
        <th>Data/Hora</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabela.querySelector('tbody')!;
  partidasModo.forEach(p => {
    tbody.appendChild(criarLinhaTabela(p));
  });

  container.appendChild(tabela);
  return container;
}


function criarLinhaTabela(partida: Partida): HTMLTableRowElement {
  const linha = document.createElement('tr');

  const tagCell = document.createElement('td');
  tagCell.textContent = partida.tag_jogador;

  const nomeCell = document.createElement('td');
  nomeCell.textContent = partida.nome_jogador;

  const pontuacaoCell = document.createElement('td');
  pontuacaoCell.textContent = partida.pontuacao.toString();

  const dificuldadeCell = document.createElement('td');
  dificuldadeCell.textContent = partida.dificuldade;

  const modoCell = document.createElement('td');
  modoCell.textContent = partida.modo;

  const duracaoCell = document.createElement('td');
  duracaoCell.textContent = partida.duracao;

  const dataHoraCell = document.createElement('td');
  dataHoraCell.textContent = `${partida.data} ${partida.hora}`;

  linha.appendChild(tagCell);
  linha.appendChild(nomeCell);
  linha.appendChild(pontuacaoCell);
  linha.appendChild(dificuldadeCell);
  linha.appendChild(modoCell);
  linha.appendChild(duracaoCell);
  linha.appendChild(dataHoraCell);

  return linha;
}


document.addEventListener('DOMContentLoaded', async () => {
  const rankingContainer = document.getElementById('ranking');
  if (!rankingContainer) return;

  const partidas = await buscarPartidas();
  partidas.sort((a, b) => b.pontuacao - a.pontuacao);

  const competitivo = partidas.filter(p => p.modo === 'Competitivo');
  const cooperativo = partidas.filter(p => p.modo === 'Cooperativo');



  const tabelaCompetitivo = criarTabela('Ranking Competitivo', competitivo);
  const tabelaCooperativo = criarTabela('Ranking Cooperativo', cooperativo);

  rankingContainer.appendChild(tabelaCompetitivo);
  rankingContainer.appendChild(tabelaCooperativo);
});
