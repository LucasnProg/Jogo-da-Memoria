document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form-login') as HTMLFormElement;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = (document.getElementById('nick') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const senha = (document.getElementById('senha') as HTMLInputElement).value;

    try {
      const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      if (response.status === 409) {
        alert('Esse jogador já existe. Faça login.');
        window.location.href = '../index.html'; 
      }  else if (response.status === 201){
        alert('Cadastro realizado com sucesso!');
        setTimeout(() => {window.location.href = '../index.html';}, 300);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao tentar cadastrar. Tente novamente.');
    }
  });
});
