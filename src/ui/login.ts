document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login') as HTMLFormElement;
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const senha = (document.getElementById('senha') as HTMLInputElement).value;
  
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email, senha })
        });
  
        if (response.status === 409) {
            alert('Esse jogador não está cadastrado.\nFaça o seu cadastro.'); 
        } else if(response.status === 407){
            alert('Login inválido, tente novamente');
        }
         else if (response.status === 201){
            window.location.href="./main/main-index-menu.html";
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao tentar logar. Tente novamente.');
      }
    });
  });
  