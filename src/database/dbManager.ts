import Database from 'better-sqlite3';
import { Jogador, Partida } from '../models';

const db = new Database('jogoDaMemoria.db');
function iniciarDataBase():void{
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

function iniciarJogador(nome:string, tag:string):void{
    db.prepare('INSERT INTO partidas(nome_jogador, tag_jogador) VALUES (?,?)').run(nome, tag);
}

function registrarPartida(nick: string, dificuldade: string, modo: string, pontos: number): void {
    db.prepare('UPDATE partidas SET dificuldade = ?, modo = ?, pontuacao = ? WHERE nome_jogador = ?')
      .run(dificuldade, modo, pontos, nick);
}

function consultarPartidas(): Partida[] {
    const rows = db.prepare('SELECT * FROM partidas').all();
    return rows as Partida[];
}

function verificarJogadorExiste(nick: string,tag: string): boolean {
    const jogador = db.prepare('SELECT * FROM partidas WHERE (nome_jogador = ? AND tag_jogador = ?)').get(nick,tag);
    return jogador !== undefined;
  }

  

iniciarDataBase();

export {registrarPartida, consultarPartidas, verificarJogadorExiste, iniciarDataBase, iniciarJogador};
//db.prepare('INSERT INTO players (name) VALUES (?)').run('Lucas');

//const players = db.prepare('SELECT * FROM players').all();
//console.log(players);
