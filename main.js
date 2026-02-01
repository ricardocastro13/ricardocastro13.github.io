const btnNao = document.querySelector("#btnNao")

let fugas = 0

function mover() {
  const margem = 20
  const maxX = window.innerWidth - btnNao.offsetWidth - margem
  const maxY = window.innerHeight - btnNao.offsetHeight - margem

  const x = Math.random() * maxX
  const y = Math.random() * maxY

  btnNao.style.position = "fixed"
  btnNao.style.left = x + "px"
  btnNao.style.top = y + "px"
  btnNao.style.zIndex = "9999"
}

btnNao.addEventListener("mouseenter", () => {
  mover()
  fugas += 1
  if (fugas >= 8) btnNao.textContent = "para 😭"
})

btnNao.addEventListener("click", (e) => {
  e.preventDefault()
  window.location.href = "Labnao/index.html"
})