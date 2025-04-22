"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbManager_1 = require("../database/dbManager");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, dbManager_1.iniciarDataBase)();
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    if ((0, dbManager_1.verificarJogadorExiste)(email, nome)) {
        return res.status(409).json({ message: 'Jogador já existe' });
    }
    (0, dbManager_1.adicionarJogador)(nome, email, senha);
    return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
});
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!(0, dbManager_1.verificarEmailExiste)(email)) {
        return res.status(409).json({ message: 'Jogador não existe' });
    }
    else if (!(0, dbManager_1.verificarLogin)(email, senha)) {
        return res.status(407).json({ message: 'Senha ou email incorretos' });
    }
    return res.status(201).json({ message: 'Login realizado com sucesso!' });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
