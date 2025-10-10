document.addEventListener('DOMContentLoaded', () => {

  // 1️⃣ Passa por aqui - muda texto ao passar o rato
  const passa = document.querySelector('#passa');
  const mensagem = document.querySelector('#mensagem');

  passa.addEventListener('mouseover', () => {
    mensagem.textContent = 'Olá! Passaste por aqui 😄';
  });

  passa.addEventListener('mouseout', () => {
    mensagem.textContent = 'Texto original';
  });

  // 2️⃣ Pinta-me - muda cor ao clicar (USANDO ARROW FUNCTION)
  const pinta = document.querySelector('#pinta');
  const mudaCor = (button) => {
    pinta.style.color = button.dataset.color;
  };

  document.querySelectorAll('button[data-color]').forEach(button => {
    button.addEventListener('click', () => mudaCor(button));
  });

  // 3️⃣ Experimenta escrever - muda fundo a cada letra
  const caixaTexto = document.querySelector('#caixaTexto');
  const cores = ['lightblue', 'lightgreen', 'lightpink', 'khaki', 'lavender'];
  let indiceCor = 0;

  caixaTexto.addEventListener('keyup', () => {
    document.body.style.backgroundColor = cores[indiceCor];
    indiceCor = (indiceCor + 1) % cores.length;
  });

  // 4️⃣ Escolhe uma cor (select)
  const seletor = document.querySelector('#seletor');
  seletor.addEventListener('change', function() {
    if (this.value) {
      document.body.style.backgroundColor = this.value;
    }
  });

  // 5️⃣ Contador com localStorage
  const contadorElem = document.querySelector('#contador');
  const btnConta = document.querySelector('#btnConta');

  let contador = localStorage.getItem('contador') || 0;
  contadorElem.textContent = contador;

  btnConta.addEventListener('click', () => {
    contador++;
    contadorElem.textContent = contador;
    localStorage.setItem('contador', contador);
  });

});