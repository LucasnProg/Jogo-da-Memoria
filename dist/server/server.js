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
app.post('/iniciar', (req, res) => {
    const { nick, tag } = req.body;
    if ((0, dbManager_1.verificarJogadorExiste)(nick, tag)) {
        return res.status(409).json({ message: 'Essa tag, não está mais disponível para esse nome de jogador!' });
    }
    else {
        return res.status(201).json({ message: 'nick, armazenado com sucesso!' });
    }
});
app.post('/registrar-partida', (req, res) => {
    const { nick, tag, dificuldade, modo, pontos, duracao, data, hora } = req.body;
    try {
        (0, dbManager_1.registrarPartida)(nick, tag, dificuldade, modo, pontos, duracao, data, hora);
        res.status(201).json({ message: 'Partida registrada com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao registrar partida:', error);
        res.status(500).json({ message: 'Erro interno ao registrar partida.' });
    }
});
app.get('/ranking', (req, res) => {
    try {
        const partidas = (0, dbManager_1.getPartidas)();
        res.status(200).json(partidas);
    }
    catch (error) {
        console.error('Erro ao obter partidas:', error);
        res.status(500).json({ message: 'Erro ao buscar partidas.' });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
