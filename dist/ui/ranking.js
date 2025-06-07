"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function buscarPartidas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/ranking');
            if (!response.ok)
                throw new Error('Erro ao buscar partidas');
            const partidas = yield response.json();
            return partidas;
        }
        catch (error) {
            console.error('Erro ao buscar partidas:', error);
            return [];
        }
    });
}
function criarTabela(titulo, partidasModo) {
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
    const tbody = tabela.querySelector('tbody');
    partidasModo.forEach(p => {
        tbody.appendChild(criarLinhaTabela(p));
    });
    container.appendChild(tabela);
    return container;
}
function criarLinhaTabela(partida) {
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
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const rankingContainer = document.getElementById('ranking');
    if (!rankingContainer)
        return;
    const partidas = yield buscarPartidas();
    partidas.sort((a, b) => b.pontuacao - a.pontuacao);
    const competitivo = partidas.filter(p => p.modo === 'Competitivo');
    const cooperativo = partidas.filter(p => p.modo === 'Cooperativo');
    const tabelaCompetitivo = criarTabela('Ranking Competitivo', competitivo);
    const tabelaCooperativo = criarTabela('Ranking Cooperativo', cooperativo);
    rankingContainer.appendChild(tabelaCompetitivo);
    rankingContainer.appendChild(tabelaCooperativo);
}));
