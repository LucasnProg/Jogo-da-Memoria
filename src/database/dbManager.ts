import Database from 'better-sqlite3';
import { Jogador, Partida } from '../models';

const db = new Database('jogoDaMemoria.db');
function iniciarDataBase():void{
    db.prepare(`CREATE TABLE IF NOT EXISTS jogadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome VARCHAR(100) NOT NULL, 
        email VARCHAR(100) NOT NULL, 
        senha VARCHAR(50) NOT NULL, 
        pontuacao INTEGER)`
        ).run();
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

function adicionarJogador(nome:string, email:string, senha:string):void{
    db.prepare('INSERT INTO jogadores(nome, email,senha,pontuacao) VALUES (?,?,?,?)').run(nome,email,senha,0);
}

function registrarPartida(usuarioId: number, duracao: string, data: string): void {
    db.prepare('INSERT INTO partidas (usuario_id, duracao, data) VALUES (?, ?, ?)').run(usuarioId, duracao, data);
}

function consultarJogadores(): Jogador[] {
    const jogadores = db.prepare('SELECT * FROM jogadores').all();
    return jogadores as Jogador[];
  }

function consultarPartidas(): Partida[] {
    const rows = db.prepare('SELECT * FROM partidas').all();
    return rows as Partida[];
}

function verificarLogin(email: string, senha: string): boolean {
    const jogador = db.prepare('SELECT * FROM jogadores WHERE email = ? AND senha = ?').get(email, senha);
    return jogador ? true : false;
}

function verificarJogadorExiste(email: string, nome: string): boolean {
    const jogador = db.prepare('SELECT * FROM jogadores WHERE email = ? AND nome = ?').get(email, nome);
    return jogador !== undefined;
  }
function verificarEmailExiste(email: string):boolean{
  const jogador = db.prepare('SELECT * FROM jogadores WHERE email = ?').get(email);
  return jogador !== undefined;
}
  

iniciarDataBase();

export { adicionarJogador, verificarLogin, registrarPartida, consultarJogadores, consultarPartidas, verificarJogadorExiste, iniciarDataBase, verificarEmailExiste};
//db.prepare('INSERT INTO players (name) VALUES (?)').run('Lucas');

//const players = db.prepare('SELECT * FROM players').all();
//console.log(players);
