import Database from 'better-sqlite3';
interface Partida {
  tag_jogador: string,
  nome_jogador: string,
  dificuldade: string,
  modo : string,
  duracao : string,
  pontuacao : number,
  data : string,
  hora: string
}


const db = new Database('jogoDaMemoria.db');
function iniciarDataBase():void{
        db.prepare(`
            CREATE TABLE IF NOT EXISTS partidas (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              tag_jogador TEXT,
              nome_jogador TEXT,
              dificuldade TEXT,
              modo TEXT,
              duracao TEXT,
              pontuacao REAL,
              data TEXT,
              hora TEXT
            );
          `).run();
}

function iniciarJogador(nome:string, tag:string):void{
    db.prepare('INSERT INTO partidas(nome_jogador, tag_jogador) VALUES (?,?)').run(nome, tag);
}

function registrarPartida(nick: string, tag:string, dificuldade: string, modo: string, pontos: number, duracao: string, data:string, hora: string): void {
    db.prepare('INSERT INTO partidas(tag_jogador, nome_jogador, dificuldade, modo, duracao, pontuacao, data, hora) VALUES (?,?,?,?,?,?,?,?) ')
      .run(tag, nick, dificuldade, modo, duracao, pontos,data, hora);
}

function getPartidas(): Partida[] {
    const rows = db.prepare('SELECT * FROM partidas').all();
    return rows as Partida[];
}

function verificarJogadorExiste(nick: string,tag: string): boolean {
    const jogador = db.prepare('SELECT * FROM partidas WHERE (nome_jogador = ? AND tag_jogador = ?)').get(nick,tag);
    return jogador !== undefined;
  }

  

iniciarDataBase();

export {registrarPartida, getPartidas, verificarJogadorExiste, iniciarDataBase, iniciarJogador};
