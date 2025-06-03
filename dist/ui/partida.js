"use strict";
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
const imgPath = "../../public/src/";
let jogadas = 0;
let tempo = 0;
let cartaPausar = false;
let vezDoJogador = true;
let intervalo;
let cartasViradas = [];
let cartasViradasMaquina = [];
let paresCertosJogador = 0;
let paresCertosMaquina = 0;
let tabuleiroMemoriaJogadasJogador;
let tabuleiroMemoriaJogadasMaquina;
const { modo, dificuldade } = verficarModoDeJogo();
const numJogadas = dificuldade === "facil" ? 2
    : dificuldade === "medio" ? 3
        : 4;
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
function atualizarConjuntosEncontrados() {
    paresCertosJogador++;
    const pontosElements = document.getElementById("encontros");
    if (pontosElements)
        pontosElements.textContent = "Conjuntos encontrados: " + paresCertosJogador.toString();
}
function atualizarCronometro() {
    tempo++;
    const minutos = Math.floor(tempo / 60).toString().padStart(2, "0");
    const segs = (tempo % 60).toString().padStart(2, "0");
    const cronometroElemento = document.getElementById("cronometro");
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
        pausarCronometro();
        setTimeout(() => {
            alert("Parabéns! Você encontrou todos os pares.");
        }, 1000);
    }
}
function verficarModoDeJogo() {
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");
    const dificuldade = params.get("dificuldade");
    return { modo, dificuldade };
}
function verificarCartasViradas(cartas) {
    if (cartaPausar === true) {
        cartaPausar = false;
    }
    let imagens = cartas.map(carta => carta.querySelector(".carta-frente").style.backgroundImage);
    if (imagens.every(img => img === imagens[0])) {
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
        atualizarConjuntosEncontrados();
    }
    else {
        const modoExtremoGabarito = {
            'url("../../public/src/ts.png")': 4,
            'url("../../public/src/python.png")': 4,
            'url("../../public/src/php.png")': 3,
            'url("../../public/src/java.png")': 3,
            'url("../../public/src/ruby.png")': 3,
            'url("../../public/src/csharp.png")': 3,
            'url("../../public/src/js.png")': 2,
            'url("../../public/src/c++.png")': 2,
            'url("../../public/src/ouro.png")': 1,
            'url("../../public/src/prata.png")': 1,
            'url("../../public/src/bronze.png")': 1
        };
        const frequencias = {};
        for (const img of imagens) {
            frequencias[img] = (frequencias[img] || 0) + 1;
        }
        for (const img in frequencias) {
            if (frequencias[img] === modoExtremoGabarito[img]) {
                if (img === 'url("../../public/src/ouro.png")') {
                    setTimeout(() => {
                        cartasViradas.forEach(carta => {
                            if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                                setTimeout(() => { carta.classList.add("fixada"); }, 300);
                            }
                        });
                        alert(`Você encontrou uma carta especial dourada, que sorte grande!\n\nUm conjunto de cartas será revelado para você!`);
                    }, 1000);
                    poderCartaDourada();
                }
                else if (img === 'url("../../public/src/prata.png")') {
                    setTimeout(() => {
                        cartasViradas.forEach(carta => {
                            if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                                setTimeout(() => { carta.classList.add("fixada"); }, 300);
                            }
                        });
                        alert(`Você encontrou uma carta especial prateada, que sorte!\n\nVocê podera jogar 2 vezes seguidas!`);
                    }, 1000);
                    vezDoJogador = true;
                }
                else if (img === 'url("../../public/src/bronze.png")') {
                    setTimeout(() => {
                        cartasViradas.forEach(carta => {
                            if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                                setTimeout(() => { carta.classList.add("fixada"); }, 300);
                            }
                        });
                        alert(`Você encontrou uma carta especial bronzeada, que sorte!\n\nVocê terá seu cronometro e contador de jogadas pausado na proxima rodada!`);
                    }, 1000);
                    cartaPausar = true;
                }
                else {
                    atualizarConjuntosEncontrados();
                }
            }
            else {
                cartasViradas.forEach(carta => {
                    if (carta.querySelector(".carta-frente").style.backgroundImage == img) {
                        setTimeout(() => { carta.classList.remove("virada"); }, 300);
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
            // Filtra cartas ouro, prata e bronze antes de adicionar
            if (imagem !== 'url("../../public/src/prata.png")' &&
                imagem !== 'url("../../public/src/ouro.png")' &&
                imagem !== 'url("../../public/src/bronze.png")') {
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
    const grupoAleatorio = gruposValidos[Math.floor(Math.random() * gruposValidos.length)];
    grupoAleatorio.forEach(carta => {
        carta.classList.add("virada");
    });
    atualizarConjuntosEncontrados();
}
function poderCartaPrata() {
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
        costas.style.backgroundImage = `url("${imgPath}"carta-traseira.png}")`;
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
                cartasViradas.length === numJogadas)
                return;
            carta.classList.add("virada");
            cartasViradas.push(carta);
            if (cartaPausar === false) {
                atualizarNumJogadasInterface();
            }
            if (cartasViradas.length === numJogadas) {
                tabuleiroMemoriaJogadasJogador = getTabuleiroAtual();
                vezDoJogador = false;
                pausarCronometro();
                if (dificuldade === "extremo") {
                    jogadaModoExtremo(cartasViradas);
                    setTimeout(() => { }, 500);
                    cartasViradas = [];
                    verificarFimDaPartida();
                }
                else {
                    if (verificarCartasViradas(cartasViradas)) {
                        cartasViradas = [];
                        atualizarConjuntosEncontrados();
                        verificarFimDaPartida();
                    }
                    else {
                        setTimeout(() => {
                            cartasViradas.forEach(carta => carta.classList.remove("virada"));
                            cartasViradas = [];
                        }, 1000);
                    }
                    if (!vezDoJogador) {
                        setTimeout(() => {
                            jogadaMaquinaCompetitivo();
                        }, 2500);
                    }
                }
                if (vezDoJogador && !cartaPausar && intervalo === undefined) {
                    iniciarCronometro();
                }
            }
        });
        cartasContainer === null || cartasContainer === void 0 ? void 0 : cartasContainer.appendChild(carta);
    });
}
function atualizarMemoriaJogadasMaquina() {
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
    if (carta === "ouro.png" ||
        carta === "prata.png" ||
        carta === "bronze.png") {
        return false;
    }
    /*PRINTA MATRIZ DA MEMORIA
    let matrizFormatada = tabuleiroMemoriaJogadasMaquina.map(
      linha => linha.map(carta => carta.padEnd(10)).join(" ")
    ).join("\n");
  
    alert("memoria da máquina: \n"+matrizFormatada);
  
    matrizFormatada = tabuleiroMemoriaJogadasJogador.map(
      linha => linha.map(carta => carta.padEnd(10)).join(" ")
    ).join("\n");
  
    alert("memoria da jogador: \n"+matrizFormatada);*/
    for (let i = 0; i < tabuleiroGabarito.length; i++) {
        for (let j = 0; j < tabuleiroGabarito[i].length; j++) {
            if ((tabuleiroMemoriaJogadasJogador[i][j] === carta || tabuleiroMemoriaJogadasMaquina[i][j] === carta)
                && !tabuleiroGabarito[i][j].classList.contains("virada")) {
                tabuleiroGabarito[i][j].classList.add("virada");
                cartasViradasMaquina.push(tabuleiroGabarito[i][j]);
                return true;
            }
        }
    }
    return false;
}
function verificaEspecial(cartaEscolhida) {
    const frenteDaCarta = cartaEscolhida.querySelector(".carta-frente");
    setTimeout(() => { }, 1000);
    for (let i = 0; i < tabuleiroGabarito.length; i++) {
        for (let j = 0; j < tabuleiroGabarito[i].length; j++) {
            if (frenteDaCarta.style.backgroundImage === 'url("../../public/src/prata.png")'
                || frenteDaCarta.style.backgroundImage === 'url("../../public/src/ouro.png")'
                || frenteDaCarta.style.backgroundImage === 'url("../../public/src/bronze.png")') {
                return true;
            }
        }
    }
    return false;
}
function jogadaMaquinaCompetitivo() {
    var _a;
    let efetuarJogada = true;
    if (dificuldade != "extremo") {
        do {
            let linha = getRandom(0, 2);
            let coluna = getRandom(0, 8);
            if (!tabuleiroGabarito[linha][coluna].classList.contains("virada") &&
                !tabuleiroGabarito[linha][coluna].classList.contains("fixada") &&
                !verificaEspecial(tabuleiroGabarito[linha][coluna])) {
                tabuleiroGabarito[linha][coluna].classList.add("virada");
                cartasViradasMaquina.push(tabuleiroGabarito[linha][coluna]);
                let cartaVirada = tabuleiroGabarito[linha][coluna].querySelector(".carta-frente").style.backgroundImage;
                let cartaViradaImg = (_a = cartaVirada.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace(/[")]/g, "");
                if (cartasViradasMaquina.length != numJogadas && lembrar(cartaViradaImg)) {
                    paresCertosMaquina++;
                    cartasViradasMaquina = [];
                    verificarFimDaPartida();
                    efetuarJogada = false;
                }
                else if (cartasViradasMaquina.length == numJogadas && verificarCartasViradas(cartasViradasMaquina)) {
                    cartasViradasMaquina = [];
                    paresCertosMaquina++;
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
    atualizarMemoriaJogadasMaquina();
}
iniciarPartida();
const tabuleiroGabarito = getTabuleiroGabarito();
tabuleiroMemoriaJogadasMaquina = getTabuleiroAtual();
/*for (let i = 0; i < tabuleiroMaquina.length; i++) {
  console.log(tabuleiroMaquina[i]);
}*/ 
