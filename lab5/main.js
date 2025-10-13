document.addEventListener('DOMContentLoaded', () => {

  const passa = document.querySelector('#passa');
  const mensagem = document.querySelector('#mensagem');

  passa.addEventListener('mouseover', () => {
    mensagem.textContent = 'Olá! Passaste aqui ';
  });

  passa.addEventListener('mouseout', () => {
    mensagem.textContent = 'Texto original';
  });

  const pinta = document.querySelector('#pinta');

  document.querySelectorAll('button[data-color]').forEach(button => {
    button.addEventListener('click', () => {
      const cor = button.dataset.color;
      pinta.style.color = cor;
      pinta.textContent = `Agora estou ${cor}`;
    });
  });

  const caixaTexto = document.querySelector('#caixaTexto');
  const cores = ['lightblue', 'lightgreen', 'lightpink', 'khaki', 'lavender'];
  let indiceCor = 0;

  caixaTexto.addEventListener('keyup', () => {
    document.body.style.backgroundColor = cores[indiceCor];
    indiceCor = (indiceCor + 1) % cores.length;
  });

  const seletor = document.querySelector('#seletor');
  seletor.addEventListener('change', function() {
    if (this.value) {
      document.body.style.backgroundColor = this.value;
    }
  });


  const contadorElem = document.querySelector('#contador');
  const btnConta = document.querySelector('#btnConta');
  let contador = Number(localStorage.getItem('contador')) || 0;
  contadorElem.textContent = contador;

  let intervalo = null;

  function count() {
    contador++;
    contadorElem.textContent = contador;
    localStorage.setItem('contador', contador);
  }

  btnConta.addEventListener('click', () => {
    if (!intervalo) {
      
      intervalo = setInterval(count, 1000);
      btnConta.textContent = 'Parar Contador';
    } else {
      
      clearInterval(intervalo);
      intervalo = null;
      btnConta.textContent = 'Iniciar Contador';
    }
  });

  const nomeInput = document.querySelector('#nome');
  const idadeInput = document.querySelector('#idade');
  const btnMostrar = document.querySelector('#btnMostrar');
  const frase = document.querySelector('#frase');

  btnMostrar.addEventListener('click', () => {
    const nome = nomeInput.value.trim();
    const idade = idadeInput.value.trim();

    if (!nome || !idade) {
      frase.textContent = 'Por favor, preenche o nome e a idade.';
      frase.style.color = 'red';
    } else {
      frase.style.color = 'black';
      frase.textContent = `Olá ${nome}! Tens ${idade} anos.`;
    }
  });

});