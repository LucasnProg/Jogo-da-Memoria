import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';


import { iniciarDataBase, verificarJogadorExiste, iniciarJogador} from '../database/dbManager';

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

/*
app.post('/cadastro', (req: Request , res: Response)=> { 
  const { nome, email, senha } = req.body;

  if (verificarJogadorExiste(email, nome)) {
    return res.status(409).json({ message: 'Jogador já existe' });
  }

  adicionarJogador(nome, email, senha);
  return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
});*/

app.post('/iniciar', (req: Request , res: Response)=> { 
  const {nick, tag} = req.body;

  if (verificarJogadorExiste(nick, tag)) {
    return res.status(409).json({ message: 'Essa tag, não está mais disponível para esse nome de jogador!' });
  } else{
    iniciarJogador(nick, tag);
    return res.status(201).json({ message: 'nick, inserido com sucesso!' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
