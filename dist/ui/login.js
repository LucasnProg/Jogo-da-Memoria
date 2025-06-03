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
function contatarServidor(nick, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/iniciar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nick, tag })
            });
            if (response.status === 409) {
                return false;
            }
            else if (response.status === 201) {
                return true;
            }
        }
        catch (error) {
            console.error('Erro:', error);
            alert('Erro ao tentar logar. Tente novamente.');
        }
        return false;
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login');
    form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const nick = document.getElementById('nick').value;
        const tag = document.getElementById('tag').value;
        const login = yield contatarServidor(nick, tag);
        if (login) {
            alert('Seja bem vindo!');
            window.location.href = "../../public/main/main-menu.html";
        }
        else {
            alert('Essa tag, não está mais disponível para esse nome de jogador!');
        }
    }));
});
