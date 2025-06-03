"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarPartida = registrarPartida;
exports.consultarPartidas = consultarPartidas;
exports.verificarJogadorExiste = verificarJogadorExiste;
exports.iniciarDataBase = iniciarDataBase;
exports.iniciarJogador = iniciarJogador;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default('jogoDaMemoria.db');
function iniciarDataBase() {
    db.prepare(`
            CREATE TABLE IF NOT EXISTS partidas (
              tag_jogador TEXT,
              nome_jogador TEXT,
              dificuldade TEXT,
              modo TEXT,
              duracao TEXT,
              pontuacao INTEGER,
              PRIMARY KEY(tag_jogador, nome_jogador)
            );
          `).run();
}
function iniciarJogador(nome, tag) {
    db.prepare('INSERT INTO partidas(nome_jogador, tag_jogador) VALUES (?,?)').run(nome, tag);
}
function registrarPartida(nick, dificuldade, modo, pontos) {
    db.prepare('UPDATE partidas SET dificuldade = ?, modo = ?, pontuacao = ? WHERE nome_jogador = ?')
        .run(dificuldade, modo, pontos, nick);
}
function consultarPartidas() {
    const rows = db.prepare('SELECT * FROM partidas').all();
    return rows;
}
function verificarJogadorExiste(nick, tag) {
    const jogador = db.prepare('SELECT * FROM partidas WHERE (nome_jogador = ? AND tag_jogador = ?)').get(nick, tag);
    return jogador !== undefined;
}
iniciarDataBase();
//db.prepare('INSERT INTO players (name) VALUES (?)').run('Lucas');
//const players = db.prepare('SELECT * FROM players').all();
//console.log(players);
