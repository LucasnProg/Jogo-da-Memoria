"use strict";
function selecionarConfiguracoesJogo(groupId) {
    const container = document.getElementById(groupId);
    const buttons = container.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
        });
    });
}
function getValorBotao(groupId) {
    var _a;
    const selected = document.querySelector(`#${groupId} .selected`);
    return (_a = selected === null || selected === void 0 ? void 0 : selected.value) !== null && _a !== void 0 ? _a : null;
}
selecionarConfiguracoesJogo("modo-botoes");
selecionarConfiguracoesJogo("dificuldade-botoes");
document.getElementById("continuar-botao").addEventListener("click", () => {
    const modoSelecionado = getValorBotao("modo-botoes");
    const dificuldadeSelecionada = getValorBotao("dificuldade-botoes");
    if (!modoSelecionado || !dificuldadeSelecionada) {
        alert("Por favor, selecione o modo de jogo e a dificuldade para prosseguir.");
        return;
    }
    if (confirm(`O modo de jogo selecionado foi: ${modoSelecionado.toUpperCase()}\nA dificuldade selecionada foi: ${dificuldadeSelecionada.toUpperCase()}\n\n deseja continuar?`)) {
        iniciarJogo(modoSelecionado, dificuldadeSelecionada);
    }
});
function iniciarJogo(modo, dificuldade) {
    window.location.href = `../jogo/partida.html?modo=${encodeURIComponent(modo)}&dificuldade=${encodeURIComponent(dificuldade)}`;
}
