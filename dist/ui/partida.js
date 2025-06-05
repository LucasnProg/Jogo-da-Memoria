"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cartasContainer = document.getElementById("cartas");
const cartasImagensFacil = ["c.png", "csharp.png", "c++.png", "java.png",
    "js.png", "kotlin.png", "lua.png", "php.png", "python.png",
    "r.png", "ruby.png", "ts.png"];
const cartasImagensMedio = ["c.png", "csharp.png", "c++.png", "java.png",
    "js.png", "kotlin.png", "python.png", "ts.png"];
const cartasImagensDificil = ["c.png", "csharp.png", "java.png",
    "js.png", "python.png", "ts.png"];
const cartasImagensExtremo = ["ts.png", "ts.png", "ts.png", "ts.png",
    "python.png", "python.png", "python.png", "python.png", "js.png", "js.png",
    "c++.png", "c++.png", "php.png", "php.png", "php.png", "java.png", "java.png",
    "java.png", "ruby.png", "ruby.png", "ruby.png", "csharp.png", "csharp.png",
    "csharp.png"];
const cartasEspeciais = ["ouro.png", "prata.png", "prata.png", "bronze.png", "bronze.png", "bronze.png"];
const imgPath = "/src/";
const data_hora = new Date();
const hora_partida = data_hora.toLocaleTimeString();
const data_partida = data_hora.toLocaleDateString();
let jogadas = 0;
let numRodadas = 0;
let cartaPausar = false;
let vezDoJogador = true;
let intervalo;
let cartasViradas = [];
let cartasViradasMaquina = [];
let paresCertosJogador = 0;
let paresCertosMaquina = 0;
let tabuleiroParaDicas;
let tabuleiroMemoriaJogadasJogador;
let tabuleiroMemoriaJogadasMaquina;
const { modo, dificuldade } = verficarModoDeJogo();
const numJogadas = dificuldade === "facil" ? 2
    : dificuldade === "medio" ? 3
        : 4;
const botaoDica = document.getElementById("dica");
let dicaUsada = false;
botaoDica.addEventListener("click", () => {
    if (!vezDoJogador)
        return;
    if (cartasViradas.length > 0) {
        alert("Você ja virou uma carta, a dica só poderá ser usada na próxima rodada!");
        return;
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            const carta = tabuleiroGabarito[i][j];
            if (verificaEspecial(carta) &&
                !carta.classList.contains("virada") &&
                !carta.classList.contains("fixada")) {
                botaoDica.classList.remove("ativo");
                botaoDica.disabled = true;
                alert(`Dica: há uma carta especial na posição Linha ${i + 1}, Coluna ${j + 1}`);
                dicaUsada = true;
                return;
            }
        }
    }
    const desejaUsarMesmoAssim = confirm("Todas as cartas especiais já foram reveladas.\n\nMas, você pode ganhar o poder da carta dourada, isso implicara em +5 jogadas no contador e +20 segundos no cronometro.\n\nVocê deseja esse poder?");
    if (desejaUsarMesmoAssim) {
        poderCartaDourada();
        if (modo === "Competitivo") {
            tempo = tempo + 20;
        }
        else {
            tempo = tempo - 20;
        }
        jogadas = jogadas + 5;
        atualizarNumJogadasInterface();
        vezDoJogador = false;
        numRodadas++;
        paresCertosJogador++;
        atualizarPlacar();
        if (modo === "Competitivo")
            pausarCronometro();
        setTimeout(() => {
            JogadaMaquina();
        }, 1000);
    }
    else {
        alert("Você perdeu sua oportunidade!");
    }
    dicaUsada = true;
    botaoDica.classList.remove("ativo");
    botaoDica.disabled = true;
});
let tempo;
if (modo === "Competitivo") {
    tempo = 0;
}
else if (dificuldade === "facil") {
    tempo = 300;
}
else if (dificuldade === "medio") {
    tempo = 240;
}
else if (dificuldade === "dificil") {
    tempo = 180;
}
else if (dificuldade === "extremo") {
    tempo = 120;
}
//algoritmo de Fisher-Yates Shuffle
function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function atualizarNumJogadasInterface() {
    jogadas++;
    const jogadasEl = document.getElementById("num-jogadas");
    if (jogadasEl)
        jogadasEl.textContent = "Jogadas: " + jogadas.toString();
}
function atualizarPlacar() {
    const placar = document.getElementById("encontros");
    if (placar && modo === "Competitivo") {
        placar.textContent = "Jogador: " + paresCertosJogador.toString() + " x " + paresCertosMaquina.toString() + " Máquina";
    }
    else if (placar && modo === "Cooperativo") {
        placar.textContent = "Conjuntos encontrados:\n" + (paresCertosJogador + paresCertosMaquina).toString();
    }
}
function atualizarCronometro() {
    const cronometroElemento = document.getElementById("cronometro");
    if (modo === "Competitivo") {
        tempo++;
    }
    else {
        tempo--;
        if (tempo <= 30) {
            cronometroElemento === null || cronometroElemento === void 0 ? void 0 : cronometroElemento.classList.add("acabando");
        }
        if (tempo <= 0) {
            tempo = 0;
            pausarCronometro();
            if (cronometroElemento) {
                cronometroElemento.textContent = "00:00";
                cronometroElemento.classList.remove("acabando");
            }
            if (confirm("O tempo acabou! A partida cooperativa terminou.\n\nDeseja tentar novamente, neste modo e dificuldade?")) {
                location.reload();
            }
            else {
                window.location.href = "/main/main-menu.html";
            }
        }
    }
    const minutos = Math.floor(tempo / 60).toString().padStart(2, "0");
    const segs = (tempo % 60).toString().padStart(2, "0");
    if (cronometroElemento) {
        cronometroElemento.textContent = `${minutos}:${segs}`;
    }
}
function iniciarCronometro() {
    intervalo = setInterval(atualizarCronometro, 1000);
}
function pausarCronometro() {
    clearInterval(intervalo);
    intervalo = undefined;
}
function verificarFimDaPartida() {
    const todasCartas = document.querySelectorAll(".carta");
    const cartasViradasAgora = document.querySelectorAll(".carta.virada");
    if (todasCartas.length === (cartasViradasAgora.length + 3)) {
        clearInterval(intervalo);
        intervalo = undefined;
        const modoPeso = modo === "Competitivo" ? 3 : modo === "Cooperativo" ? 1.5 : 0;
        const dificuldadePeso = dificuldade === "facil" ? 1.5 : dificuldade === "medio" ? 2 : dificuldade === "dificil" ? 2.5 : dificuldade === "extremo" ? 2 : 0;
        const pontos = ((paresCertosJogador * dificuldadePeso * modoPeso) / (1 + (tempo / numJogadas))) * 10;
        if (modo === "Competitivo") {
            if (paresCertosJogador > paresCertosMaquina) {
                setTimeout(() => {
                    if (confirm(`Parabéns, você ganhou!\n\nSua pontuação foi: ${pontos}\n\nDeseja jogar novamente, neste modo e dificuldade?`)) {
                        location.reload();
                    }
                    else {
                        window.location.href = "/main/main-menu.html";
                    }
                }, 1000);
            }
            else if (paresCertosMaquina > paresCertosJogador) {
                setTimeout(() => {
                    if (confirm("Ixi, você perdeu!\n\nInfelizmente você não ganhou, então não pontuou.\n\nDeseja tentar novamente, neste modo e dificuldade?")) {
                        location.reload();
                    }
                    else {
                        window.location.href = "/main/main-menu.html";
                    }
                }, 1000);
            }
            else {
                setTimeout(() => {
                    if (confirm("Empate!\n\nInfelizmente você não ganhou, então não pontuou.\n\nDeseja tentar novamente, neste modo e dificuldade?")) {
                        location.reload();
                    }
                    else {
                        window.location.href = "/main/main-menu.html";
                    }
                }, 1000);
            }
        }
        else {
            if (tempo > 0) {
                setTimeout(() => {
                    if (confirm(`Parabéns, vocês ganharam!\n\nSua pontuação foi: ${pontos}\n\nDeseja jogar novamente, neste modo e dificuldade?`)) {
                        location.reload();
                    }
                    else {
                        window.location.href = "/main/main-menu.html";
                    }
                }, 1000);
            }
        }
    }
}
function verficarModoDeJogo() {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");
    const dificuldade = params.get("dificuldade");
    return { modo, dificuldade };
}
function verificarCartasViradas(cartas) {
    let imagens = cartas.map(carta => carta.querySelector(".carta-frente").style.backgroundImage);
    if (cartas.filter(carta => !verificaEspecial(carta)).length > 1 && imagens.every(img => img === imagens[0])) {
        return true;
    }
    else {
        cartas.forEach(carta => {
            var _a;
            const cartaImg = carta.querySelector(".carta-frente");
            const imagem = cartaImg.style.backgroundImage;
            const nomeImg = (_a = imagem.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/[")]/g, "");
            if (nomeImg === "ouro.png") {
                carta.classList.add("fixada");
                setTimeout(() => {
                    alert(`Você encontrou uma carta especial dourada, que sorte grande!\n\nUm conjunto de cartas será revelado para você!`);
                }, 1000);
                poderCartaDourada();
            }
            else if (nomeImg === "prata.png") {
                carta.classList.add("fixada");
                setTimeout(() => {
                    alert(`Você encontrou uma carta especial prateada, que sorte!\n\nVocê podera jogar 2 vezes seguidas!`);
                }, 1000);
                vezDoJogador = true;
            }
            else if (nomeImg === "bronze.png") {
                carta.classList.add("fixada");
                setTimeout(() => {
                    alert(`Você encontrou uma carta especial de bronze, que sorte!\n\nVocê terá seu cronometro e contador de jogadas pausado na proxima rodada!`);
                }, 1000);
                cartaPausar = true;
            }
        });
        return false;
    }
}
function jogadaModoExtremo(cartas) {
    if (cartaPausar === true) {
        cartaPausar = false;
    }
    let imagens = cartas.map(carta => carta.querySelector(".carta-frente").style.backgroundImage);
    if (imagens.every(img => img === imagens[0])) {
        paresCertosJogador++;
        atualizarPlacar();
    }
    else {
        const modoExtremoGabarito = {
            'url("/src/ts.png")': 4,
            'url("/src/python.png")': 4,
            'url("/src/php.png")': 3,
            'url("/src/java.png")': 3,
            'url("/src/ruby.png")': 3,
            'url("/src/csharp.png")': 3,
            'url("/src/js.png")': 2,
            'url("/src/c++.png")': 2,
            'url("/src/ouro.png")': 1,
            'url("/src/prata.png")': 1,
            'url("/src/bronze.png")': 1
        };
        const frequencias = {};
        for (const img of imagens) {
            frequencias[img] = (frequencias[img] || 0) + 1;
        }
        for (const img in frequencias) {
            if (frequencias[img] === modoExtremoGabarito[img]) {
                if (img === 'url("/src/ouro.png")') {
                    setTimeout(() => {
                        cartasViradas.forEach(carta => {
                            if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                                setTimeout(() => { carta.classList.add("fixada"); }, 500);
                            }
                        });
                        alert(`Você encontrou uma carta especial dourada, que sorte grande!\n\nUm conjunto de cartas será revelado para você!`);
                    }, 1000);
                    poderCartaDourada();
                }
                else if (img === 'url("/src/prata.png")') {
                    setTimeout(() => {
                        cartasViradas.forEach(carta => {
                            if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                                setTimeout(() => { carta.classList.add("fixada"); }, 500);
                            }
                        });
                        alert(`Você encontrou uma carta especial prateada, que sorte!\n\nVocê podera jogar 2 vezes seguidas!`);
                    }, 1000);
                    vezDoJogador = true;
                }
                else if (img === 'url("/src/bronze.png")') {
                    setTimeout(() => {
                        cartasViradas.forEach(carta => {
                            if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                                setTimeout(() => { carta.classList.add("fixada"); }, 500);
                            }
                        });
                        alert(`Você encontrou uma carta especial bronzeada, que sorte!\n\nVocê terá seu cronometro e contador de jogadas pausado na proxima rodada!`);
                    }, 1000);
                    cartaPausar = true;
                }
                else {
                    cartas.forEach(carta => {
                        if (carta.querySelector(".carta-frente").style.backgroundImage != img) {
                            setTimeout(() => { carta.classList.remove("virada"); }, 500);
                        }
                    });
                    paresCertosJogador++;
                    atualizarPlacar();
                }
            }
            else {
                cartasViradas.forEach(carta => {
                    if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                        setTimeout(() => { carta.classList.remove("virada"); }, 500);
                    }
                });
            }
        }
    }
}
function getTabuleiroGabarito() {
    const cartasTela = document.querySelectorAll(".carta");
    const cartas = Array.from(cartasTela);
    let matriz = [];
    for (let i = 0; i < cartas.length; i += 9) {
        const linha = cartas.slice(i, i + 9);
        matriz.push(linha);
    }
    return matriz;
}
function getTabuleiroAtual() {
    const cartasTela = document.querySelectorAll(".carta");
    const cartas = Array.from(cartasTela);
    const matrizOutput = [];
    for (let i = 0; i < cartas.length; i++) {
        const linha = Math.floor(i / 9);
        const coluna = i % 9;
        if (!matrizOutput[linha]) {
            matrizOutput[linha] = [];
        }
        const carta = cartas[i];
        if (carta.classList.contains("virada") || carta.classList.contains("fixada")) {
            const frente = carta.querySelector(".carta-frente");
            const img = frente === null || frente === void 0 ? void 0 : frente.style.backgroundImage;
            if (img) {
                const partes = img.split("/");
                const nomeImagem = partes[partes.length - 1].replace(/["')]/g, "");
                matrizOutput[linha][coluna] = nomeImagem;
            }
            else {
                matrizOutput[linha][coluna] = "?";
            }
        }
        else {
            matrizOutput[linha][coluna] = "?";
        }
    }
    return matrizOutput;
}
function poderCartaDourada() {
    const mapaCartas = new Map();
    for (let linha of tabuleiroGabarito) {
        for (let carta of linha) {
            const imagem = carta.querySelector(".carta-frente").style.backgroundImage;
            if (imagem !== 'url("/src/prata.png")' &&
                imagem !== 'url("/src/ouro.png")' &&
                imagem !== 'url("/src/bronze.png")' &&
                !carta.classList.contains("virada") &&
                !carta.classList.contains("fixada")) {
                if (!mapaCartas.has(imagem)) {
                    mapaCartas.set(imagem, []);
                }
                mapaCartas.get(imagem).push(carta);
            }
        }
    }
    const gruposValidos = Array.from(mapaCartas.values()).filter(grupo => grupo.length > 1);
    if (gruposValidos.length === 0)
        return;
    const grupoEscolhido = gruposValidos[Math.floor(Math.random() * gruposValidos.length)];
    grupoEscolhido.forEach(carta => {
        carta.classList.add("virada");
    });
    paresCertosJogador++;
    atualizarPlacar();
}
function iniciarPartida() {
    cartasContainer.innerHTML = "";
    let cronometroIniciado = false;
    let cartasDaMesa = [];
    switch (dificuldade) {
        case "facil":
            cartasDaMesa = embaralharArray([...cartasImagensFacil, ...cartasImagensFacil, ...embaralharArray(cartasEspeciais).slice(0, 3)]);
            break;
        case "medio":
            cartasDaMesa = embaralharArray([...cartasImagensMedio, ...cartasImagensMedio, ...cartasImagensMedio, ...embaralharArray(cartasEspeciais).slice(0, 3)]);
            break;
        case "dificil":
            cartasDaMesa = embaralharArray([...cartasImagensDificil, ...cartasImagensDificil, ...cartasImagensDificil, ...cartasImagensDificil, ...embaralharArray(cartasEspeciais).slice(0, 3)]);
            break;
        case "extremo":
            cartasDaMesa = embaralharArray([...cartasImagensExtremo, ...embaralharArray(cartasEspeciais).slice(0, 3)]);
            break;
    }
    ;
    const placar = document.getElementById("encontros");
    if (placar && modo === "Competitivo") {
        placar.textContent = "Jogador: " + paresCertosJogador.toString() + " x " + paresCertosMaquina.toString() + " Máquina";
    }
    else if (placar && modo === "Cooperativo") {
        placar.textContent = "Conjuntos encontrados:\n" + (paresCertosJogador + paresCertosMaquina).toString();
    }
    cartasDaMesa.forEach((nomeImg, index) => {
        const carta = document.createElement("div");
        carta.className = "carta";
        carta.dataset.id = index.toString();
        const cartaInner = document.createElement("div");
        cartaInner.className = "carta-inner";
        const frente = document.createElement("div");
        frente.className = "carta-frente";
        frente.style.backgroundImage = `url("${imgPath + nomeImg}")`;
        const costas = document.createElement("div");
        costas.className = "carta-costas";
        costas.style.backgroundImage = `url("${imgPath}carta-traseira.png")`;
        cartaInner.appendChild(frente);
        cartaInner.appendChild(costas);
        carta.appendChild(cartaInner);
        carta.addEventListener("click", () => {
            if (!cronometroIniciado) {
                iniciarCronometro();
                cronometroIniciado = true;
            }
            if (carta.classList.contains("virada") ||
                carta.classList.contains("fixada") ||
                cartasViradas.length === numJogadas
                || !vezDoJogador)
                return;
            carta.classList.add("virada");
            cartasViradas.push(carta);
            if (!cartaPausar) {
                atualizarNumJogadasInterface();
            }
            if (cartasViradas.length === numJogadas) {
                numRodadas++;
                if (dificuldade === "facil" || numRodadas === 1) {
                    tabuleiroMemoriaJogadasJogador = getTabuleiroAtual();
                }
                else {
                    atualizarMemoriaJogadasJogador();
                }
                vezDoJogador = false;
                if (cartaPausar) {
                    cartaPausar = false;
                    iniciarCronometro();
                }
                if (modo === "Competitivo") {
                    pausarCronometro();
                }
                if (dificuldade === "extremo") {
                    jogadaModoExtremo(cartasViradas);
                    setTimeout(() => { }, 500);
                    cartasViradas = [];
                    verificarFimDaPartida();
                }
                else {
                    if (verificarCartasViradas(cartasViradas)) {
                        cartasViradas = [];
                        paresCertosJogador++;
                        atualizarPlacar();
                        verificarFimDaPartida();
                    }
                    else {
                        setTimeout(() => {
                            cartasViradas.forEach(carta => carta.classList.remove("virada"));
                            cartasViradas = [];
                        }, 1000);
                    }
                }
                if (!vezDoJogador) {
                    setTimeout(() => {
                        JogadaMaquina();
                    }, 1000);
                }
                else if (!cartaPausar && modo === "Competitivo") {
                    iniciarCronometro();
                }
            }
            if (modo === "Competitivo" && paresCertosJogador === 3 && !dicaUsada) {
                botaoDica.disabled = false;
                botaoDica.classList.add("ativo");
            }
            else if (modo === "Cooperativo" && (paresCertosJogador + paresCertosMaquina) === 4 && !dicaUsada) {
                botaoDica.disabled = false;
                botaoDica.classList.add("ativo");
            }
        });
        cartasContainer === null || cartasContainer === void 0 ? void 0 : cartasContainer.appendChild(carta);
    });
}
function esquecerUmajogadaJogador() {
    let esquecidas = 0;
    let tentativas = 0;
    while (esquecidas < numJogadas && tentativas < 10) {
        tentativas++;
        let linha = getRandom(0, 2);
        let coluna = getRandom(0, 8);
        const carta = tabuleiroGabarito[linha][coluna];
        if (!carta.classList.contains("virada") &&
            !carta.classList.contains("fixada") &&
            !verificaEspecial(carta) &&
            tabuleiroMemoriaJogadasJogador[linha][coluna] !== "?") {
            tabuleiroMemoriaJogadasJogador[linha][coluna] = "?";
            esquecidas++;
        }
    }
}
function atualizarMemoriaJogadasJogador() {
    var _a;
    if (modo === "Competitivo") {
        if (dificuldade === "medio" && numRodadas == 3) {
            esquecerUmajogadaJogador();
            numRodadas = 0;
        }
    }
    for (let linha = 0; linha < tabuleiroMemoriaJogadasJogador.length; linha++) {
        for (let coluna = 0; coluna < tabuleiroMemoriaJogadasJogador[linha].length; coluna++) {
            if ((tabuleiroGabarito[linha][coluna].classList.contains("virada") || tabuleiroGabarito[linha][coluna].classList.contains("fixada")) && tabuleiroMemoriaJogadasJogador[linha][coluna] === "?") {
                const frente = (_a = tabuleiroGabarito[linha][coluna].querySelector(".carta-frente")) === null || _a === void 0 ? void 0 : _a.style.backgroundImage;
                if (frente) {
                    const partes = frente.split("/");
                    const frente_carta = partes[partes.length - 1].replace(/["')]/g, "");
                    tabuleiroMemoriaJogadasJogador[linha][coluna] = frente_carta;
                }
            }
        }
    }
}
function esquecerUmajogadaMaquina() {
    let esquecidas = 0;
    let tentativas = 0;
    while (esquecidas < numJogadas && tentativas < 10) {
        tentativas++;
        let linha = getRandom(0, 2);
        let coluna = getRandom(0, 8);
        const carta = tabuleiroGabarito[linha][coluna];
        if (!carta.classList.contains("virada") &&
            !carta.classList.contains("fixada") &&
            !verificaEspecial(carta) &&
            tabuleiroMemoriaJogadasMaquina[linha][coluna] !== "?") {
            tabuleiroMemoriaJogadasMaquina[linha][coluna] = "?";
            esquecidas++;
        }
    }
}
function atualizarMemoriaJogadasMaquina() {
    if (modo === "Competitivo") {
        if (dificuldade === "facil" && numRodadas === 4) {
            esquecerUmajogadaJogador();
            numRodadas = 0;
        }
        else if (dificuldade === "medio" && numRodadas === 6) {
            esquecerUmajogadaJogador();
            numRodadas = 0;
        }
    }
    const cartasTela = document.querySelectorAll(".carta");
    const cartas = Array.from(cartasTela);
    for (let i = 0; i < cartas.length; i++) {
        const linha = Math.floor(i / 9);
        const coluna = i % 9;
        const carta = cartas[i];
        if ((carta.classList.contains("virada") || carta.classList.contains("fixada")) && tabuleiroMemoriaJogadasMaquina[linha][coluna] === "?") {
            const frente = carta.querySelector(".carta-frente");
            const img = frente === null || frente === void 0 ? void 0 : frente.style.backgroundImage;
            if (img) {
                const partes = img.split("/");
                const nomeImagem = partes[partes.length - 1].replace(/["')]/g, "");
                tabuleiroMemoriaJogadasMaquina[linha][coluna] = nomeImagem;
            }
        }
    }
}
function lembrar(carta) {
    for (let i = 0; i < tabuleiroGabarito.length; i++) {
        for (let j = 0; j < tabuleiroGabarito[i].length; j++) {
            if ((tabuleiroMemoriaJogadasJogador[i][j] === carta || tabuleiroMemoriaJogadasMaquina[i][j] === carta)
                && !tabuleiroGabarito[i][j].classList.contains("virada")) {
                tabuleiroGabarito[i][j].classList.add("virada");
                cartasViradasMaquina.push(tabuleiroGabarito[i][j]);
                return;
            }
        }
    }
}
function verificaEspecial(cartaEscolhida) {
    const frenteDaCarta = cartaEscolhida.querySelector(".carta-frente");
    setTimeout(() => { }, 1000);
    for (let i = 0; i < tabuleiroGabarito.length; i++) {
        for (let j = 0; j < tabuleiroGabarito[i].length; j++) {
            if (frenteDaCarta.style.backgroundImage === 'url("/src/prata.png")'
                || frenteDaCarta.style.backgroundImage === 'url("/src/ouro.png")'
                || frenteDaCarta.style.backgroundImage === 'url("/src/bronze.png")') {
                return true;
            }
        }
    }
    return false;
}
function VerificarCartasViradasExtremo(cartas) {
    let imagens = cartas.map(carta => carta.querySelector(".carta-frente").style.backgroundImage);
    if (imagens.every(img => img === imagens[0])) {
        return true;
    }
    else {
        const modoExtremoGabarito = {
            'url("/src/ts.png")': 4,
            'url("/src/python.png")': 4,
            'url("/src/php.png")': 3,
            'url("/src/java.png")': 3,
            'url("/src/ruby.png")': 3,
            'url("/src/csharp.png")': 3,
            'url("/src/js.png")': 2,
            'url("/src/c++.png")': 2
        };
        const frequencias = {};
        for (const img of imagens) {
            frequencias[img] = (frequencias[img] || 0) + 1;
        }
        for (const img in frequencias) {
            if (frequencias[img] === modoExtremoGabarito[img]) {
                cartas.forEach(carta => {
                    if (carta.querySelector(".carta-frente").style.backgroundImage != img) {
                        setTimeout(() => { carta.classList.remove("virada"); }, 500);
                    }
                });
                return true;
            }
            else {
                cartas.forEach(carta => {
                    if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                        setTimeout(() => { carta.classList.remove("virada"); }, 500);
                    }
                });
            }
        }
        return false;
    }
}
function JogadaMaquina() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (modo === "Cooperativo") {
            if (cartaPausar) {
                pausarCronometro();
            }
        }
        let efetuarJogada = true;
        if (dificuldade != "extremo") {
            do {
                yield delay(800);
                let linha = getRandom(0, 2);
                let coluna = getRandom(0, 8);
                if (!tabuleiroGabarito[linha][coluna].classList.contains("virada") &&
                    !tabuleiroGabarito[linha][coluna].classList.contains("fixada") &&
                    !verificaEspecial(tabuleiroGabarito[linha][coluna])) {
                    if (modo === "Cooperativo") {
                        jogadas++;
                        atualizarNumJogadasInterface();
                    }
                    tabuleiroGabarito[linha][coluna].classList.add("virada");
                    cartasViradasMaquina.push(tabuleiroGabarito[linha][coluna]);
                    let cartaVirada = tabuleiroGabarito[linha][coluna].querySelector(".carta-frente").style.backgroundImage;
                    let cartaViradaImg = (_a = cartaVirada.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/[")]/g, "");
                    if (cartasViradasMaquina.length != numJogadas &&
                        cartasViradasMaquina.every(carta => carta.querySelector(".carta-frente").style.backgroundImage === cartasViradasMaquina[0].querySelector(".carta-frente").style.backgroundImage)) {
                        lembrar(cartaViradaImg);
                    }
                    if (cartasViradasMaquina.length == numJogadas && verificarCartasViradas(cartasViradasMaquina)) {
                        cartasViradasMaquina = [];
                        paresCertosMaquina++;
                        atualizarPlacar();
                        verificarFimDaPartida();
                        efetuarJogada = false;
                    }
                    else if (cartasViradasMaquina.length == numJogadas && !verificarCartasViradas(cartasViradasMaquina)) {
                        setTimeout(() => {
                            cartasViradasMaquina.forEach(carta => carta.classList.remove("virada"));
                            cartasViradasMaquina = [];
                        }, 1000);
                        efetuarJogada = false;
                    }
                }
            } while (efetuarJogada === true);
        }
        else {
            do {
                yield delay(800);
                let linha = getRandom(0, 2);
                let coluna = getRandom(0, 8);
                if (!tabuleiroGabarito[linha][coluna].classList.contains("virada") &&
                    !tabuleiroGabarito[linha][coluna].classList.contains("fixada") &&
                    !verificaEspecial(tabuleiroGabarito[linha][coluna])) {
                    if (modo === "Cooperativo") {
                        jogadas++;
                        atualizarNumJogadasInterface();
                    }
                    tabuleiroGabarito[linha][coluna].classList.add("virada");
                    cartasViradasMaquina.push(tabuleiroGabarito[linha][coluna]);
                    let cartaVirada = tabuleiroGabarito[linha][coluna].querySelector(".carta-frente").style.backgroundImage;
                    let cartaViradaImg = (_b = cartaVirada.split('/').pop()) === null || _b === void 0 ? void 0 : _b.replace(/[")]/g, "");
                    if (cartasViradasMaquina.length != numJogadas &&
                        cartasViradasMaquina.every(carta => carta.querySelector(".carta-frente").style.backgroundImage === cartasViradasMaquina[0].querySelector(".carta-frente").style.backgroundImage)) {
                        lembrar(cartaViradaImg);
                    }
                    if (cartasViradasMaquina.length == numJogadas && VerificarCartasViradasExtremo(cartasViradasMaquina)) {
                        cartasViradasMaquina = [];
                        paresCertosMaquina++;
                        atualizarPlacar();
                        verificarFimDaPartida();
                        efetuarJogada = false;
                    }
                    else if (cartasViradasMaquina.length == numJogadas && !VerificarCartasViradasExtremo(cartasViradasMaquina)) {
                        setTimeout(() => {
                            cartasViradasMaquina.forEach(carta => carta.classList.remove("virada"));
                            cartasViradasMaquina = [];
                        }, 1000);
                        efetuarJogada = false;
                    }
                }
            } while (efetuarJogada === true);
        }
        atualizarMemoriaJogadasMaquina();
        yield delay(800);
        vezDoJogador = true;
        if (!cartaPausar && intervalo === undefined && modo === "Competitivo") {
            iniciarCronometro();
        }
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
iniciarPartida();
const tabuleiroGabarito = getTabuleiroGabarito();
tabuleiroMemoriaJogadasMaquina = getTabuleiroAtual();
tabuleiroParaDicas = getTabuleiroAtual();
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 9; j++) {
        console.log(tabuleiroGabarito[i][j].querySelector(".carta-frente").style.backgroundImage);
    }
}
