window.addEventListener("DOMContentLoaded", () => {
  const range = document.querySelector("#range")
  const value = document.querySelector("#value")
  const msg = document.querySelector("#msg")
  const after = document.querySelector("#after")

  const startBtn = document.querySelector("#start")
  const arena = document.querySelector("#arena")
  const timeEl = document.querySelector("#time")
  const pointsEl = document.querySelector("#points")
  const resultEl = document.querySelector("#result")

  if (!range || !value || !msg || !after || !startBtn || !arena || !timeEl || !pointsEl || !resultEl) {
    alert("Faltam elementos no HTML (ids).")
    return
  }

  const messages = [
    " ama me menos",
    " so 1 é insano",
    " da para subir mais isso va",
    " podia ser pior",
    " que vontadinha ein!!!!",
    " mediano ok",
    " podias subir mais um bocado",
    " ja nao esta mau",
    " uepaaaaaaa",
    " meu deus sou incrivel",
    " CASAMENTO"
  ]

  const afterMsgs = [
    "Sem pressão. Mas eu vou tentar subir isso 😌",
    "Ok… eu vou conquistar mais pontos.",
    "Prometo fazer-te rir.",
    "Ainda dá para virar o jogo.",
    "Atenção: risco de te apaixonares.",
    "Agora é só manter e viver.",
    "Estou feliz.",
    "Ok… estou MESMO feliz.",
    "Eu já ganhei o dia.",
    "Eu vou-me gabar disto.",
    "Eu não vou esquecer isto nunca."
  ]

  function updateText() {
    const v = Number(range.value)
    value.textContent = v
    msg.textContent = messages[v]
    
  }

  range.addEventListener("input", updateText)
  updateText()

  let playing = false
  let points = 0
  let timeLeft = 15
  let spawner = null
  let timer = null

  function rand(min, max) {
    return Math.random() * (max - min) + min
  }

  function getArenaSize() {
    const w = arena.clientWidth
    const h = arena.clientHeight
    return { w, h }
  }

  function spawnHeart() {
    const { w, h } = getArenaSize()
    if (w < 80 || h < 80) return

    const x = rand(40, w - 40)
    const y = rand(40, h - 40)

    const el = document.createElement("div")
    el.className = "heart"
    el.textContent = "💗"
    el.style.left = x + "px"
    el.style.top = y + "px"

    el.addEventListener("click", () => {
      if (!playing) return
      points += 1
      pointsEl.textContent = points
      el.remove()
    })

    arena.appendChild(el)

    setTimeout(() => {
      el.remove()
    }, 900)
  }

  function endGame() {
    playing = false
    clearInterval(spawner)
    clearInterval(timer)
    spawner = null
    timer = null

    Array.from(arena.querySelectorAll(".heart")).forEach(n => n.remove())

    const v = Number(range.value)
    let text = `Acabou! Fizeste ${points} pontos. `

    if (points >= 18) text += "Ok… isso foi INSANO. Mimo garantido 😭💘"
    else if (points >= 12) text += "Muito bom! Estás a dar sinais ótimos 😌"
    else if (points >= 7) text += "Boa! Ainda dá para melhorar 😏"
    else text += "Hmm… suspeito. Vamos repetir? 😈"

    if (v >= 8) text += ` (e esse teu ${v}/10… eu vi 😌)`

    resultEl.textContent = text
    startBtn.disabled = false
    startBtn.textContent = "jogar outra vez"
  }

  function startGame() {
    if (playing) return
    const { w, h } = getArenaSize()
    if (w < 80 || h < 80) {
      alert("A arena está sem tamanho. Confere o CSS (.arena height).")
      return
    }

    playing = true
    points = 0
    timeLeft = 15
    pointsEl.textContent = points
    timeEl.textContent = timeLeft
    resultEl.textContent = ""
    startBtn.disabled = true
    startBtn.textContent = "a jogar..."

    spawner = setInterval(spawnHeart, 450)

    timer = setInterval(() => {
      timeLeft -= 1
      timeEl.textContent = timeLeft
      if (timeLeft <= 0) endGame()
    }, 1000)
  }

  startBtn.addEventListener("click", startGame)
})
