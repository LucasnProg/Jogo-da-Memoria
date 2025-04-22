"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicionarJogador = adicionarJogador;
exports.verificarLogin = verificarLogin;
exports.registrarPartida = registrarPartida;
exports.consultarJogadores = consultarJogadores;
exports.consultarPartidas = consultarPartidas;
exports.verificarJogadorExiste = verificarJogadorExiste;
exports.iniciarDataBase = iniciarDataBase;
exports.verificarEmailExiste = verificarEmailExiste;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default('jogoDaMemoria.db');
function iniciarDataBase() {
    db.prepare(`CREATE TABLE IF NOT EXISTS jogadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome VARCHAR(100) NOT NULL, 
        email VARCHAR(100) NOT NULL, 
        senha VARCHAR(50) NOT NULL, 
        pontuacao INTEGER)`).run();
    db.prepare(`
            CREATE TABLE IF NOT EXISTS partidas (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              usuario_id INTEGER NOT NULL,
              duracao TEXT,
              data TEXT,
              FOREIGN KEY (usuario_id) REFERENCES jogadores(id)
            )
          `).run();
}
function adicionarJogador(nome, email, senha) {
    db.prepare('INSERT INTO jogadores(nome, email,senha,pontuacao) VALUES (?,?,?,?)').run(nome, email, senha, 0);
}
function registrarPartida(usuarioId, duracao, data) {
    db.prepare('INSERT INTO partidas (usuario_id, duracao, data) VALUES (?, ?, ?)').run(usuarioId, duracao, data);
}
function consultarJogadores() {
    const jogadores = db.prepare('SELECT * FROM jogadores').all();
    return jogadores;
}
function consultarPartidas() {
    const rows = db.prepare('SELECT * FROM partidas').all();
    return rows;
}
function verificarLogin(email, senha) {
    const jogador = db.prepare('SELECT * FROM jogadores WHERE email = ? AND senha = ?').get(email, senha);
    return jogador ? true : false;
}
function verificarJogadorExiste(email, nome) {
    const jogador = db.prepare('SELECT * FROM jogadores WHERE email = ? AND nome = ?').get(email, nome);
    return jogador !== undefined;
}
function verificarEmailExiste(email) {
    const jogador = db.prepare('SELECT * FROM jogadores WHERE email = ?').get(email);
    return jogador !== undefined;
}
iniciarDataBase();
//db.prepare('INSERT INTO players (name) VALUES (?)').run('Lucas');
//const players = db.prepare('SELECT * FROM players').all();
//console.log(players);
