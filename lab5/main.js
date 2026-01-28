let tarefas = []

const txt = document.querySelector("#txt")
const add = document.querySelector("#add")
const filtro = document.querySelector("#filtro")
const ordenar = document.querySelector("#ordenar")
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")

function render() {
  lista.innerHTML = ""

  let mostrar = tarefas.slice()

  if (filtro.value === "feitas") {
    mostrar = mostrar.filter(function (t) {
      return t.feita === true
    })
  }

  if (filtro.value === "porfazer") {
    mostrar = mostrar.filter(function (t) {
      return t.feita === false
    })
  }

  for (let i = 0; i < mostrar.length; i++) {
    const li = document.createElement("li")
    li.textContent = mostrar[i].texto + " "

    const btn = document.createElement("button")
    btn.textContent = mostrar[i].feita ? "Desfazer" : "Feita"

    btn.onclick = (function (textoTarefa) {
      return function () {
        for (let j = 0; j < tarefas.length; j++) {
          if (tarefas[j].texto === textoTarefa) {
            tarefas[j].feita = !tarefas[j].feita
            break
          }
        }
        render()
      }
    })(mostrar[i].texto)

    li.appendChild(btn)
    lista.appendChild(li)
  }

  let feitas = 0
  for (let i = 0; i < tarefas.length; i++) {
    if (tarefas[i].feita) feitas = feitas + 1
  }

  info.textContent = "Total: " + tarefas.length + " | Feitas: " + feitas
}

add.onclick = function () {
  const texto = txt.value

  if (texto === "") return

  tarefas.push({ texto: texto, feita: false })
  txt.value = ""
  render()
}

filtro.onchange = function () {
  render()
}

ordenar.onclick = function () {
  tarefas.sort(function (a, b) {
    if (a.texto.toLowerCase() < b.texto.toLowerCase()) return -1
    if (a.texto.toLowerCase() > b.texto.toLowerCase()) return 1
    return 0
  })
  render()
}

render()