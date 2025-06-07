import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';


import { iniciarDataBase, verificarJogadorExiste, registrarPartida, getPartidas } from '../database/dbManager';

const app = express();
const PORT = 3000;

iniciarDataBase();

app.use(express.json());
app.use(cors());

const publicPath = path.join(__dirname, '../../public');
const distPath = path.join(__dirname, '../../dist');


app.use('/dist', express.static(distPath));
app.use(express.static(publicPath));


app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


app.post('/iniciar', (req: Request, res: Response) => {
  const { nick, tag } = req.body;

  if (verificarJogadorExiste(nick, tag)) {
    return res.status(409).json({ message: 'Essa tag, não está mais disponível para esse nome de jogador!' });
  } else {
    return res.status(201).json({ message: 'nick, armazenado com sucesso!' });
  }
});

app.post('/registrar-partida', (req: Request, res: Response) => {
  const { nick,tag, dificuldade, modo, pontos, duracao, data, hora } = req.body;

  try {
    registrarPartida(nick, tag,dificuldade, modo, pontos, duracao, data, hora);
    res.status(201).json({ message: 'Partida registrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar partida:', error);
    res.status(500).json({ message: 'Erro interno ao registrar partida.' });
  }
});

app.get('/ranking', (req: Request, res: Response) => {
  try {
    const partidas = getPartidas();

    res.status(200).json(partidas);
  } catch (error) {
    console.error('Erro ao obter partidas:', error);
    res.status(500).json({ message: 'Erro ao buscar partidas.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
