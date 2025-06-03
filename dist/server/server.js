"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dbManager_1 = require("../database/dbManager");
const app = (0, express_1.default)();
const PORT = 3000;
(0, dbManager_1.iniciarDataBase)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const publicPath = path_1.default.join(__dirname, '../../public');
const distPath = path_1.default.join(__dirname, '../../dist');
app.use('/dist', express_1.default.static(distPath));
app.use(express_1.default.static(publicPath));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
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
app.post('/iniciar', (req, res) => {
    const { nick, tag } = req.body;
    if ((0, dbManager_1.verificarJogadorExiste)(nick, tag)) {
        return res.status(409).json({ message: 'Essa tag, não está mais disponível para esse nome de jogador!' });
    }
    else {
        (0, dbManager_1.iniciarJogador)(nick, tag);
        return res.status(201).json({ message: 'nick, inserido com sucesso!' });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
