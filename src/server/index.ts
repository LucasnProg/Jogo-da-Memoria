import express, { Request, Response } from 'express';
import cors from 'cors';


import { iniciarDataBase, verificarJogadorExiste, adicionarJogador, verificarLogin, verificarEmailExiste } from '../database/dbManager';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
iniciarDataBase();


app.post('/cadastro', (req: Request , res: Response)=> { 
  const { nome, email, senha } = req.body;

  if (verificarJogadorExiste(email, nome)) {
    return res.status(409).json({ message: 'Jogador já existe' });
  }

  adicionarJogador(nome, email, senha);
  return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
});

app.post('/login', (req: Request , res: Response)=> { 
  const {email, senha } = req.body;

  if (!verificarEmailExiste(email)) {
    return res.status(409).json({ message: 'Jogador não existe' });
  } else if(!verificarLogin(email, senha)){
    return res.status(407).json({message : 'Senha ou email incorretos'})
  }

  return res.status(201).json({ message: 'Login realizado com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
