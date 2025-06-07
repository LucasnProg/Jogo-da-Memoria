async function contatarServidor(nick:string, tag:string):Promise<boolean>{
  try {
        const response = await fetch('/iniciar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({nick, tag})
        });
  
       if(response.status === 409){
          return false;
        }
         else if (response.status === 201){
          return true
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao tentar logar. Tente novamente.');
      }

  return false;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login') as HTMLFormElement;
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const nick = (document.getElementById('nick') as HTMLInputElement).value;
      const tag = (document.getElementById('tag') as HTMLInputElement).value;
      
      const login = await contatarServidor(nick,tag);
      if (login){
        localStorage.setItem('nick', nick);
        localStorage.setItem('tag', tag);
        alert('Seja bem vindo!');
        window.location.href="/main/main-menu.html";
      } else {
        alert('Essa tag, não está mais disponível para esse nome de jogador!');
      }
    });
  });
  