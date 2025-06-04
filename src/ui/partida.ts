const cartasContainer = document.getElementById("cartas");

const cartasImagensFacil = ["c.png","csharp.png","c++.png","java.png",
  "js.png","kotlin.png","lua.png","php.png","python.png",
  "r.png","ruby.png","ts.png"];

  const cartasImagensMedio = ["c.png","csharp.png","c++.png","java.png",
  "js.png","kotlin.png","python.png","ts.png"];

const cartasImagensDificil = ["c.png","csharp.png","java.png",
  "js.png","python.png","ts.png"];

const cartasImagensExtremo = ["ts.png","ts.png","ts.png", "ts.png",
  "python.png","python.png","python.png","python.png","js.png","js.png",
  "c++.png","c++.png","php.png","php.png","php.png","java.png","java.png",
  "java.png","ruby.png", "ruby.png", "ruby.png","csharp.png","csharp.png",
  "csharp.png"]

const cartasEspeciais = ["ouro.png", "prata.png","prata.png", "bronze.png","bronze.png","bronze.png"];

const imgPath = "/src/";
let jogadas = 0;
let tempo = 0;
let numRodadas = 0;
let cartaPausar : boolean = false;
let vezDoJogador : boolean = true;
let intervalo : ReturnType<typeof setInterval> | undefined;
let cartasViradas: HTMLElement[] = [];
let cartasViradasMaquina: HTMLElement[] = [];
let paresCertosJogador = 0;
let paresCertosMaquina = 0;
let tabuleiroMemoriaJogadasJogador : string[][];
let tabuleiroMemoriaJogadasMaquina : string[][];
const{modo,dificuldade} = verficarModoDeJogo();
const numJogadas = dificuldade==="facil" ? 2 
               : dificuldade==="medio" ? 3
               : 4;

//algoritmo de Fisher-Yates Shuffle
function embaralharArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandom(min: number, max: number): number {
  min = Math.ceil(min);   
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function atualizarNumJogadasInterface(): void {
  jogadas++;
  const jogadasEl = document.getElementById("num-jogadas");
  if (jogadasEl) jogadasEl.textContent = "Jogadas: "+jogadas.toString();
}

function atualizarPlacar(): void {
  const placar = document.getElementById("encontros");
  if (placar && modo==="Competitivo") {
    placar.textContent = "Jogador: "+ paresCertosJogador.toString() +" x "+ paresCertosMaquina.toString()+" Máquina";
  } else if(placar && modo==="Cooperativo"){
    placar.textContent = "Conjuntos encontrados:\n"+ (paresCertosJogador + paresCertosMaquina).toString();
  }
}

function atualizarCronometro(): void {
  tempo++;
  const minutos = Math.floor(tempo / 60).toString().padStart(2, "0");
  const segs = (tempo % 60).toString().padStart(2, "0");

  const cronometroElemento = document.getElementById("cronometro");
  if (cronometroElemento) {
    cronometroElemento.textContent = `${minutos}:${segs}`;
  }
}

function iniciarCronometro(): void {
  intervalo = setInterval(atualizarCronometro, 1000);
}

function pausarCronometro(): void {
  clearInterval(intervalo);
  intervalo = undefined;
}

function verificarFimDaPartida():void{
  const todasCartas = document.querySelectorAll(".carta");
  const cartasViradasAgora = document.querySelectorAll(".carta.virada");

  if (todasCartas.length === (cartasViradasAgora.length+3)) {
    clearInterval(intervalo);
    intervalo = undefined;
    if(paresCertosJogador>paresCertosMaquina){
      const modoPeso = modo==="Competitivo" ? 3 : modo==="Cooperativo" ? 1.5 : 0;
      const dificuldadePeso = dificuldade==="facil" ? 1.5 : dificuldade==="medio" ? 2 : dificuldade==="dificil" ? 2.5 : dificuldade==="extremo" ? 2 : 0;
      const pontos = (paresCertosJogador * dificuldadePeso * modoPeso) / (1 + (tempo / numJogadas));
      setTimeout(() => {
        alert(`Parabéns! Você ganhou!\n\nModo: ${modoPeso}\nDificuldade: ${dificuldadePeso} Sua pontuação foi: ${pontos}`);
      }, 1000);
    } else if(paresCertosMaquina>paresCertosJogador){
      setTimeout(() => {
        alert("Você perdeu! tente novamente.");
      }, 1000);
    } else{
      setTimeout(() => {
        alert("Empate! tente novamente.");
      }, 1000);
    }
    
  }
}

function verficarModoDeJogo(): {modo: string | null, dificuldade: string|null} {
  const params = new URLSearchParams(window.location.search);
  const modo = params.get("modo");
  const dificuldade = params.get("dificuldade");

  return { modo, dificuldade };  
}

function verificarCartasViradas(cartas: HTMLElement[]): boolean {
  let imagens = cartas.map(carta => (carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage);
  if (imagens.every(img => img === imagens[0])){
    return true;
  } else{
    cartas.forEach(carta => {
      const cartaImg = carta.querySelector(".carta-frente") as HTMLElement;
      const imagem = cartaImg.style.backgroundImage;

      const nomeImg = imagem.split('/').pop()?.replace(/[")]/g, "");
      
      if (nomeImg === "ouro.png") {
        carta.classList.add("fixada");
        setTimeout(() => {
          alert(`Você encontrou uma carta especial dourada, que sorte grande!\n\nUm conjunto de cartas será revelado para você!`
          )}, 1000);
        poderCartaDourada(); 

      } else if (nomeImg === "prata.png"){
        carta.classList.add("fixada");
        setTimeout(() => {
          alert(`Você encontrou uma carta especial prateada, que sorte!\n\nVocê podera jogar 2 vezes seguidas!`
          )}, 1000); 
        vezDoJogador = true;
      } else if (nomeImg === "bronze.png"){
        carta.classList.add("fixada");
        setTimeout(() => {
          alert(`Você encontrou uma carta especial de bronze, que sorte!\n\nVocê terá seu cronometro e contador de jogadas pausado na proxima rodada!`
          )}, 1000);
        cartaPausar = true;
      }
    });
    return false;
  }
}

function jogadaModoExtremo(cartas: HTMLElement[]): void {
  if (cartaPausar === true) {
    cartaPausar = false;
  }
  let imagens = cartas.map(carta => (carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage);
  if(imagens.every(img => img === imagens[0])){
    paresCertosJogador++;
    atualizarPlacar();
  } else{
    const modoExtremoGabarito : Record<string, number> = {
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
  }

  const frequencias: Record<string, number> = {};
  for (const img of imagens) {
    frequencias[img] = (frequencias[img] || 0) + 1;
  }

  for (const img in frequencias) {
    if (frequencias[img] === modoExtremoGabarito[img]) {
      if (img === 'url("/src/ouro.png")') {
        setTimeout(() => {
          cartasViradas.forEach(carta => {
            if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage == img){
              setTimeout(()=> {carta.classList.add("fixada");},300);
            }});
          alert(`Você encontrou uma carta especial dourada, que sorte grande!\n\nUm conjunto de cartas será revelado para você!`)}, 1000);
        poderCartaDourada(); 

      } else if (img === 'url("/src/prata.png")'){
        setTimeout(() => {
          cartasViradas.forEach(carta => {
            if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage == img){
              setTimeout(()=> {carta.classList.add("fixada");},300);
            }});
          alert(`Você encontrou uma carta especial prateada, que sorte!\n\nVocê podera jogar 2 vezes seguidas!`)}, 1000);
          vezDoJogador = true;     
      } else if (img === 'url("/src/bronze.png")'){
        setTimeout(() => {
          cartasViradas.forEach(carta => {
            if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage == img){
              setTimeout(()=> {carta.classList.add("fixada");},300);
            }});
          alert(`Você encontrou uma carta especial bronzeada, que sorte!\n\nVocê terá seu cronometro e contador de jogadas pausado na proxima rodada!`)}, 1000);
          cartaPausar = true;
      } else {
        cartas.forEach(carta => {
              if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage != img){
                setTimeout(()=> {carta.classList.remove("virada");},300);
              }})
        paresCertosJogador++;
        atualizarPlacar();
      }
    } else{
      cartasViradas.forEach(carta => {
            if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage == img){
              setTimeout(()=> {carta.classList.remove("virada");},300);
            }})
    }
  }
  }
  
}

function getTabuleiroGabarito(): HTMLElement[][]{
  const cartasTela = document.querySelectorAll(".carta");
  const cartas = Array.from(cartasTela) as HTMLElement[];

  let matriz = [];
  for (let i = 0; i < cartas.length; i += 9) {
    const linha = cartas.slice(i, i + 9);
    matriz.push(linha);
  }
  return matriz;
}

function getTabuleiroAtual(): string[][] {
  const cartasTela = document.querySelectorAll(".carta");
  const cartas = Array.from(cartasTela) as HTMLElement[];
  const matrizOutput: string[][] = [];

  for (let i = 0; i < cartas.length; i++) {
    const linha = Math.floor(i / 9);
    const coluna = i % 9;

    if (!matrizOutput[linha]) {
      matrizOutput[linha] = [];
    }

    const carta = cartas[i];

    if (carta.classList.contains("virada") || carta.classList.contains("fixada")) {
      const frente = carta.querySelector(".carta-frente") as HTMLElement;
      const img = frente?.style.backgroundImage;

      if (img) {
        const partes = img.split("/");
        const nomeImagem = partes[partes.length - 1].replace(/["')]/g, "");
        matrizOutput[linha][coluna] = nomeImagem;
      } else {
        matrizOutput[linha][coluna] = "?";
      }
    } else {
      matrizOutput[linha][coluna] = "?";
    }
  }

  return matrizOutput;
}

function poderCartaDourada(): void {
  const mapaCartas = new Map<string, HTMLElement[]>();

  for (let linha of tabuleiroGabarito) {
    for (let carta of linha) {
      const imagem = (carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage;

      if (
        imagem !== 'url("/src/prata.png")' &&
        imagem !== 'url("/src/ouro.png")' &&
        imagem !== 'url("/src/bronze.png")'
      ) {
        if (!mapaCartas.has(imagem)) {
          mapaCartas.set(imagem, []);
        }
        mapaCartas.get(imagem)!.push(carta);
      }
    }
  }

  const gruposValidos = Array.from(mapaCartas.values()).filter(grupo => grupo.length > 1);

  if (gruposValidos.length === 0) return;

  const grupoAleatorio = gruposValidos[Math.floor(Math.random() * gruposValidos.length)];

  grupoAleatorio.forEach(carta => {
    carta.classList.add("virada");
  });
  paresCertosJogador++;
  atualizarPlacar();
}

function iniciarPartida():void{
  cartasContainer!.innerHTML = "";
  let cronometroIniciado = false; 
  let cartasDaMesa: string[] = [];
    
  switch (dificuldade){
    case "facil":
      cartasDaMesa = embaralharArray([...cartasImagensFacil, ...cartasImagensFacil,...embaralharArray(cartasEspeciais).slice(0,3)]);
      break;
    case "medio":
      cartasDaMesa = embaralharArray([...cartasImagensMedio, ...cartasImagensMedio,...cartasImagensMedio,...embaralharArray(cartasEspeciais).slice(0,3)]);
      break;
    case "dificil":
      cartasDaMesa = embaralharArray([...cartasImagensDificil, ...cartasImagensDificil,...cartasImagensDificil,...cartasImagensDificil,...embaralharArray(cartasEspeciais).slice(0,3)]);
      break;
    case "extremo":
      cartasDaMesa = embaralharArray([...cartasImagensExtremo,...embaralharArray(cartasEspeciais).slice(0,3)]);
      break;
  }; 

  const placar = document.getElementById("encontros");
  if (placar && modo==="Competitivo") {
    placar.textContent = "Jogador: "+ paresCertosJogador.toString() +" x "+ paresCertosMaquina.toString()+" Máquina";
  } else if(placar && modo==="Cooperativo"){
    placar.textContent = "Conjuntos encontrados:\n"+ (paresCertosJogador + paresCertosMaquina).toString();
  }
  cartasDaMesa.forEach((nomeImg, index)=>{
  
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.id = index.toString();
  
    const cartaInner = document.createElement("div");
    cartaInner.className = "carta-inner";
  
    const frente = document.createElement("div");
    frente.className = "carta-frente";
    frente.style.backgroundImage = `url("${imgPath+nomeImg}")`; 
  
    const costas = document.createElement("div");
    costas.className = "carta-costas";
    costas.style.backgroundImage =  `url("${imgPath}carta-traseira.png")`;
  
    cartaInner.appendChild(frente);
    cartaInner.appendChild(costas);
    carta.appendChild(cartaInner);
  
    carta.addEventListener("click", () => {
      if (!cronometroIniciado) {
        iniciarCronometro();
        cronometroIniciado = true;
      }

      if(carta.classList.contains("virada") || 
         carta.classList.contains("fixada") || 
         cartasViradas.length===numJogadas
        || !vezDoJogador) return;
      

      carta.classList.add("virada");
      cartasViradas.push(carta);
      if (!cartaPausar){
        atualizarNumJogadasInterface();
      }

      if (cartasViradas.length === numJogadas){
        numRodadas++;
        if(dificuldade==="facil" || numRodadas===1){
          tabuleiroMemoriaJogadasJogador = getTabuleiroAtual();
        } else {
          atualizarMemoriaJogadasJogador();
        }
        vezDoJogador = false;
        if (cartaPausar) {
          cartaPausar = false;
        }
        pausarCronometro();
        if(dificuldade === "extremo") {
          jogadaModoExtremo(cartasViradas);
          setTimeout(() => {}, 500);
          cartasViradas = [];
          verificarFimDaPartida();
        } else{
          if (verificarCartasViradas(cartasViradas)) {
            cartasViradas = [];
            paresCertosJogador++;
            atualizarPlacar();
            verificarFimDaPartida();
          } else{
            setTimeout(() => {
              cartasViradas.forEach(carta => carta.classList.remove("virada"));
              cartasViradas = [];
            }, 1000);
          }
      }
      if(!vezDoJogador){
            setTimeout(() => {
              JogadaMaquina();
            }, 1000);
          }
      }
    });
    cartasContainer?.appendChild(carta);
  })
}

function esquecerUmajogada(): void {
  for (let index = 0; index < 2; index++) {
    let linha = getRandom(0,2);
    let coluna = getRandom(0,8);
    if(!tabuleiroGabarito[linha][coluna].classList.contains("virada") &&
      !tabuleiroGabarito[linha][coluna].classList.contains("fixada") && 
      !verificaEspecial(tabuleiroGabarito[linha][coluna]) &&
      tabuleiroMemoriaJogadasJogador[linha][coluna] != "?"
    ){
      tabuleiroMemoriaJogadasJogador[linha][coluna] = "?";
    }
    
  }

}

function atualizarMemoriaJogadasJogador(): void {
  if(dificuldade ==="medio" && numRodadas==3){
    esquecerUmajogada();
    numRodadas = 0;
  } else if(dificuldade ==="dificil" && numRodadas==4){
    esquecerUmajogada();
    numRodadas = 0;
  } else if(dificuldade ==="extremo" && numRodadas==5){
    esquecerUmajogada();
    numRodadas = 0;
  }


  for (let linha = 0; linha < tabuleiroMemoriaJogadasJogador.length; linha++) {
    for (let coluna = 0; coluna < tabuleiroMemoriaJogadasJogador[linha].length; coluna++) {
      if ((tabuleiroGabarito[linha][coluna].classList.contains("virada") || tabuleiroGabarito[linha][coluna].classList.contains("fixada")) && tabuleiroMemoriaJogadasJogador[linha][coluna] === "?") {
      const frente = (tabuleiroGabarito[linha][coluna].querySelector(".carta-frente") as HTMLElement)?.style.backgroundImage;

      if (frente) {
        const partes = frente.split("/");
        const frente_carta = partes[partes.length - 1].replace(/["')]/g, "");
        tabuleiroMemoriaJogadasJogador[linha][coluna] = frente_carta;
      }
    }
    }
  }
  
}

function atualizarMemoriaJogadasMaquina(): void {
  const cartasTela = document.querySelectorAll(".carta");
  const cartas = Array.from(cartasTela) as HTMLElement[];

  for (let i = 0; i < cartas.length; i++) {
    const linha = Math.floor(i / 9);
    const coluna = i % 9;

    const carta = cartas[i];
    
    if ((carta.classList.contains("virada") || carta.classList.contains("fixada")) && tabuleiroMemoriaJogadasMaquina[linha][coluna] === "?") {
      const frente = carta.querySelector(".carta-frente") as HTMLElement;
      const img = frente?.style.backgroundImage;

      if (img) {
        const partes = img.split("/");
        const nomeImagem = partes[partes.length - 1].replace(/["')]/g, "");
        tabuleiroMemoriaJogadasMaquina[linha][coluna] = nomeImagem;
      }
    }
  }

}


function lembrar(carta :(string|undefined)):void{
  if(carta ==="ouro.png" ||
    carta ==="prata.png" ||
    carta ==="bronze.png"
  ){
    return;
  }

  for (let i = 0; i < tabuleiroGabarito.length; i++) {
    for (let j = 0; j < tabuleiroGabarito[i].length; j++) {
      if((tabuleiroMemoriaJogadasJogador[i][j]===carta || tabuleiroMemoriaJogadasMaquina[i][j]===carta) 
        && !tabuleiroGabarito[i][j].classList.contains("virada")){

        tabuleiroGabarito[i][j].classList.add("virada");
        cartasViradasMaquina.push(tabuleiroGabarito[i][j]);
        return;
      }
    } 
  }
  
  
}

function verificaEspecial(cartaEscolhida:HTMLElement):boolean{
  const frenteDaCarta = cartaEscolhida.querySelector(".carta-frente") as HTMLElement;
  setTimeout(() => {}, 1000);
  for (let i = 0; i < tabuleiroGabarito.length; i++) {
    for (let j = 0; j < tabuleiroGabarito[i].length; j++) {
      if(frenteDaCarta.style.backgroundImage ==='url("/src/prata.png")'
         || frenteDaCarta.style.backgroundImage ==='url("/src/ouro.png")'
         || frenteDaCarta.style.backgroundImage ==='url("/src/bronze.png")'
        ){
        return true;
      }
    } 
  }
  return false;
}

function VerificarCartasViradasExtremo(cartas: HTMLElement[]): boolean {
  let imagens = cartas.map(carta => (carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage);
  if (imagens.every(img => img === imagens[0])){
    return true;
  } else{
      const modoExtremoGabarito : Record<string, number> = {
      'url("/src/ts.png")': 4,
      'url("/src/python.png")': 4,
      'url("/src/php.png")': 3,
      'url("/src/java.png")': 3,
      'url("/src/ruby.png")': 3,
      'url("/src/csharp.png")': 3,
      'url("/src/js.png")': 2,
      'url("/src/c++.png")': 2
    }

    const frequencias: Record<string, number> = {};
    for (const img of imagens) {
      frequencias[img] = (frequencias[img] || 0) + 1;
    }

    for (const img in frequencias) {
      if (frequencias[img] === modoExtremoGabarito[img]) {
        cartas.forEach(carta => {
              if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage != img){
                setTimeout(()=> {carta.classList.remove("virada");},300);
              }})
        return true;
      } else{
        cartas.forEach(carta => {
              if((carta.querySelector(".carta-frente") as HTMLElement).style.backgroundImage == img){
                setTimeout(()=> {carta.classList.remove("virada");},300);
              }})
      }
    }
    
    return false;
  }
}


async function JogadaMaquina():Promise<void>{ 
  let efetuarJogada = true;
  if(dificuldade!="extremo"){
    do{
      await delay(800);
      let linha = getRandom(0,2);
      let coluna = getRandom(0,8);
      if(!tabuleiroGabarito[linha][coluna].classList.contains("virada") &&
       !tabuleiroGabarito[linha][coluna].classList.contains("fixada") && 
       !verificaEspecial(tabuleiroGabarito[linha][coluna])
      ){
        tabuleiroGabarito[linha][coluna].classList.add("virada");
        cartasViradasMaquina.push(tabuleiroGabarito[linha][coluna]);
        let cartaVirada = (tabuleiroGabarito[linha][coluna].querySelector(".carta-frente") as HTMLElement).style.backgroundImage;
        let cartaViradaImg : (string|undefined) = cartaVirada.split('/').pop()?.replace(/[")]/g, "");

        if(cartasViradasMaquina.length !=numJogadas /*&& verificarCartasViradas(cartasViradasMaquina)*/){
          lembrar(cartaViradaImg);
        }
        if (cartasViradasMaquina.length==numJogadas && verificarCartasViradas(cartasViradasMaquina)){
          cartasViradasMaquina = [];
          paresCertosMaquina++;
          atualizarPlacar()
          verificarFimDaPartida();
          efetuarJogada = false;
        } else if (cartasViradasMaquina.length==numJogadas && !verificarCartasViradas(cartasViradasMaquina)){
          setTimeout(() => {
              cartasViradasMaquina.forEach(carta => carta.classList.remove("virada"));
              cartasViradasMaquina = [];
            }, 1000);
              efetuarJogada = false;
          }
      }
    } while (efetuarJogada === true);
  } else {
    do{
      await delay(800);
      let linha = getRandom(0,2);
      let coluna = getRandom(0,8);
      if(!tabuleiroGabarito[linha][coluna].classList.contains("virada") &&
       !tabuleiroGabarito[linha][coluna].classList.contains("fixada") && 
       !verificaEspecial(tabuleiroGabarito[linha][coluna])
      ){
        tabuleiroGabarito[linha][coluna].classList.add("virada");
        cartasViradasMaquina.push(tabuleiroGabarito[linha][coluna]);
        let cartaVirada = (tabuleiroGabarito[linha][coluna].querySelector(".carta-frente") as HTMLElement).style.backgroundImage;
        let cartaViradaImg : (string|undefined) = cartaVirada.split('/').pop()?.replace(/[")]/g, "");

        if(cartasViradasMaquina.length !=numJogadas){
          lembrar(cartaViradaImg);
        }
        if (cartasViradasMaquina.length==numJogadas && VerificarCartasViradasExtremo(cartasViradasMaquina)){
          cartasViradasMaquina = [];
          paresCertosMaquina++;
          atualizarPlacar()
          verificarFimDaPartida();
          efetuarJogada = false;
        } else if (cartasViradasMaquina.length==numJogadas && !VerificarCartasViradasExtremo(cartasViradasMaquina)){
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
  await delay(800);
  vezDoJogador = true;
  if (!cartaPausar && intervalo===undefined){
        iniciarCronometro();
      }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

iniciarPartida();
const tabuleiroGabarito = getTabuleiroGabarito();

tabuleiroMemoriaJogadasMaquina = getTabuleiroAtual();
/*for (let i = 0; i < tabuleiroMaquina.length; i++) {
  console.log(tabuleiroMaquina[i]);
}*/