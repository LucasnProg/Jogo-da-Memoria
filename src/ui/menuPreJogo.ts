function selecionarConfiguracoesJogo(groupId: string) {
    const container = document.getElementById(groupId)!;
    const buttons = container.querySelectorAll<HTMLButtonElement>("button");
  
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
      });
    });
  }
  
  function getValorBotao(groupId: string): string | null {
    const selected = document.querySelector(`#${groupId} .selected`) as HTMLButtonElement | null;
    return selected?.value ?? null;
  }
  
  selecionarConfiguracoesJogo("modo-botoes");
  selecionarConfiguracoesJogo("dificuldade-botoes");
  
  document.getElementById("continuar-botao")!.addEventListener("click", () => {
    const modoSelecionado = getValorBotao("modo-botoes");
    const dificuldadeSelecionada = getValorBotao("dificuldade-botoes");
  
    if (!modoSelecionado || !dificuldadeSelecionada) {
      alert("Por favor, selecione o modo de jogo e a dificuldade para prosseguir.");
      return;
    }
    if(confirm(`O modo de jogo selecionado foi: ${modoSelecionado.toUpperCase()}\nA dificuldade selecionada foi: ${dificuldadeSelecionada.toUpperCase()}\n\n deseja continuar?`)){
      iniciarJogo(modoSelecionado, dificuldadeSelecionada);
    } 
  });
  
  function iniciarJogo(modo: string, dificuldade: string) {
    window.location.href=`../jogo/partida.html?modo=${encodeURIComponent(modo)}&dificuldade=${encodeURIComponent(dificuldade)}`;
  }
  