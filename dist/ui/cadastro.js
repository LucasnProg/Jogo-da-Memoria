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
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login');
    form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const nome = document.getElementById('nick').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        try {
            const response = yield fetch('http://localhost:3000/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            if (response.status === 409) {
                alert('Esse jogador já existe. Faça login.');
                window.location.href = '../index.html';
            }
            else if (response.status === 201) {
                alert('Cadastro realizado com sucesso!');
                setTimeout(() => { window.location.href = '../index.html'; }, 300);
            }
        }
        catch (error) {
            console.error('Erro:', error);
            alert('Erro ao tentar cadastrar. Tente novamente.');
        }
    }));
});
