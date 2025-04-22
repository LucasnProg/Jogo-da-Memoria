export interface Jogador {
  id: number;
  nome: string;
  email: string;
  senha: string;
  pontuacao: number;
}

export interface Partida {
  id: number;
  usuario_id: number;
  duracao: string;
  data: string;
}
  