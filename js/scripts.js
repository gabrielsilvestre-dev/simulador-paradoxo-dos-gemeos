let elapsedTime = 0;
let animationProgress = 0;
let movingRight = true;
let startTime = null;
let pausedTime = 0;
let elapsedYears = 0;
let tempoAtivo = 0;
const totalYears = 80;
const element = document.getElementById("gemeo_1");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const yearsPassedGemeo1Element = document.getElementById("yearsPassedGemeo1");
const yearsPassedGemeo2Element = document.getElementById("yearsPassedGemeo2");
let isPaused = false;
let animationFrameId = null;
let elementoGemeo1 = document.querySelector("#gemeo_1");
let imgGemeo1 = document.getElementById("imgGemeo1");
let imgGemeo2 = document.getElementById("imgGemeo2");
let ifsDasIdadesGemeo1 = {
  10: false,
  18: false,
  30: false,
  50: false,
  80: false,
};
let ifsDasIdadesGemeo2 = {
  10: false,
  18: false,
  30: false,
  50: false,
  80: false,
  100: false,
};
let dilatacaoTemporalGemeo2 = 0;
let tempoDilatado = 0;
let distanciaPercorridaNave = document.getElementById(
  "distanciaPercorridaNave"
);
let distanciaPercorridaTerra = document.getElementById(
  "distanciaPercorridaTerra"
);
var slider = document.getElementById("myRange");
var output = document.getElementById("velocidadeDaNave");
output.innerHTML = slider.value;
slider.oninput = function () {
  output.innerHTML = this.value;
};

const ctx = document.getElementById("idadeGrafico").getContext("2d");
const idadeGrafico = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Idade da irmã em função da idade do irmão",
        data: [],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Idade do irmão (anos)",
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "Idade da irmã (anos)",
        },
        suggestedMin: 0,
        suggestedMax: totalYears,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            // Personalizando o título do tooltip para mostrar a idade do irmão
            const idadeIrmão = tooltipItems[0].label; // Idade do irmão
            return `Idade do irmão: ${idadeIrmão}`;
          },
          label: function (tooltipItem) {
            // Personalizando o rótulo para mostrar a idade da irmã
            const idadeIrmã = tooltipItem.raw; // Idade da irmã (dados do gráfico)
            return `Idade da irmã: ${idadeIrmã}`;
          },
        },
      },
    },
  },
});

let lastElapsedYear = -1; // Inicializa com valor inválido para garantir que o primeiro valor será adicionado

function updateVelNave() {
  const velNaveMS = 299792458 * (slider.value / 100);
  const velNaveKMH = 1079252848.8 * (slider.value / 100);
  document.getElementById("velNaveMS").innerHTML =
    "Velocidade da nave em m/s: " + velNaveMS.toFixed(2);
  document.getElementById("velNaveKMH").innerHTML =
    "Velocidade da nave em km/h: " + velNaveKMH.toFixed(2);
}

function equacaoDilatacaoTemporal(elapsedYears) {
  const velocidadeNave = 1 - (slider.value / 100) ** 2;
  dilatacaoTemporalGemeo2 = Math.round(
    elapsedYears / Math.sqrt(velocidadeNave)
  );
  return dilatacaoTemporalGemeo2;
}

function alterarImagemGemeo1(elapsedYears) {
  if (elapsedYears >= 10 && elapsedYears < 18 && !ifsDasIdadesGemeo1["10"]) {
    imgGemeo1.src = "Imagens/gemeo_1/10y_gemeo_1_space_rocket.png";
    ifsDasIdadesGemeo1["10"] = true;
  } else if (
    elapsedYears >= 18 &&
    elapsedYears < 30 &&
    !ifsDasIdadesGemeo1["18"]
  ) {
    imgGemeo1.src = "Imagens/gemeo_1/18y_gemeo_1_space_rocket.png";
    ifsDasIdadesGemeo1["18"] = true;
  } else if (
    elapsedYears >= 30 &&
    elapsedYears < 50 &&
    !ifsDasIdadesGemeo1["30"]
  ) {
    imgGemeo1.src = "Imagens/gemeo_1/30y_gemeo_1_space_rocket.png";
    ifsDasIdadesGemeo1["30"] = true;
  } else if (
    elapsedYears >= 50 &&
    elapsedYears < 80 &&
    !ifsDasIdadesGemeo1["50"]
  ) {
    imgGemeo1.src = "Imagens/gemeo_1/50y_gemeo_1_space_rocket.png";
    ifsDasIdadesGemeo1["50"] = true;
  } else if (elapsedYears >= 80 && !ifsDasIdadesGemeo1["80"]) {
    imgGemeo1.src = "Imagens/gemeo_1/80y_gemeo_1_space_rocket.png";
    ifsDasIdadesGemeo1["80"] = true;
  }
}

function alterarImagemGemeo2(tempoDilatado) {
  if (tempoDilatado >= 10 && tempoDilatado < 18 && !ifsDasIdadesGemeo2["10"]) {
    imgGemeo2.src = "Imagens/gemeo_2/10y_gemeo_2.jpg";
    ifsDasIdadesGemeo2["10"] = true;
  } else if (
    tempoDilatado >= 18 &&
    tempoDilatado < 30 &&
    !ifsDasIdadesGemeo2["18"]
  ) {
    imgGemeo2.src = "Imagens/gemeo_2/18y_gemeo_2.jpg";
    ifsDasIdadesGemeo2["18"] = true;
  } else if (
    tempoDilatado >= 30 &&
    tempoDilatado < 50 &&
    !ifsDasIdadesGemeo2["30"]
  ) {
    imgGemeo2.src = "Imagens/gemeo_2/30y_gemeo_2.jpg";
    ifsDasIdadesGemeo2["30"] = true;
  } else if (
    tempoDilatado >= 50 &&
    tempoDilatado < 80 &&
    !ifsDasIdadesGemeo2["50"]
  ) {
    imgGemeo2.src = "Imagens/gemeo_2/50y_gemeo_2.jpg";
    ifsDasIdadesGemeo2["50"] = true;
  } else if (
    tempoDilatado >= 80 &&
    tempoDilatado < 100 &&
    !ifsDasIdadesGemeo2["80"]
  ) {
    imgGemeo2.src = "Imagens/gemeo_2/80y_gemeo_2.jpg";
    ifsDasIdadesGemeo2["80"] = true;
  } else if (tempoDilatado >= 100 && !ifsDasIdadesGemeo2["100"]) {
    imgGemeo2.src = "Imagens/gemeo_2/100y_gemeo_2.jpg";
    ifsDasIdadesGemeo2["100"] = true;
  }
}

element.addEventListener("animationstart", function () {
  slider.disabled = true;
  slider.classList.add("slider-disabled");
  imgGemeo1.src = "Imagens/gemeo_1/01y_gemeo_1_space_rocket.png";
  imgGemeo2.src = "Imagens/gemeo_2/01y_gemeo_2.jpg";
  ifsDasIdadesGemeo1 = {
    10: false,
    18: false,
    30: false,
    50: false,
    80: false,
  };
  ifsDasIdadesGemeo2 = {
    10: false,
    18: false,
    30: false,
    50: false,
    80: false,
    100: false,
  };
  if (elapsedYears === 0) {
    startTime = Date.now();
    pausedTime = 0;
  }
  updateYears();
});

function atualizarDistancia(elapsedYears, tempoDilatado) {
  const distanciaPercorridaTerraValue =
    (slider.value / 100) * 299792458 * (tempoDilatado * 31557600);
  distanciaPercorridaTerra.textContent =
    "... da Terra: " + distanciaPercorridaTerraValue.toExponential(8);

  const sliderAoQuadrado = (slider.value / 100) ** 2;
  distanciaPercorridaNave.textContent =
    "... da nave: " +
    (
      distanciaPercorridaTerraValue * Math.sqrt(1 - sliderAoQuadrado)
    ).toExponential(8);
  console.log(Math.sqrt(1 - sliderAoQuadrado));
}

function atualizarAnos(elapsedTime) {
  animationProgress = (elapsedTime % 10) / 10;
  elapsedYears = Math.min(
    totalYears,
    Math.round(animationProgress * totalYears)
  );
  tempoDilatado = equacaoDilatacaoTemporal(elapsedYears);
  yearsPassedGemeo1Element.textContent = `Idade do irmão: ${elapsedYears} anos`;
  yearsPassedGemeo2Element.textContent = `Idade da irmã: ${tempoDilatado} anos`;
  alterarImagemGemeo1(elapsedYears);
  alterarImagemGemeo2(tempoDilatado);
  atualizarDistancia(elapsedYears, tempoDilatado);

  // Verifica se o ano atual já foi adicionado ao gráfico
  if (elapsedYears !== lastElapsedYear) {
    // Atualiza o gráfico com os dados correspondentes
    if (idadeGrafico) {
      idadeGrafico.data.labels.push(elapsedYears); // Eixo X
      idadeGrafico.data.datasets[0].data.push(tempoDilatado); // Eixo Y
      idadeGrafico.update(); // Atualiza o gráfico
    }

    // Atualiza o último ano adicionado
    lastElapsedYear = elapsedYears;
  }
}

function updateYears() {
  if (!isPaused) {
    const currentTime = Date.now();
    elapsedTime = (currentTime - startTime) / 1000;
    atualizarAnos(elapsedTime);
    // atualizarDistancia(elapsedTime);
    animationFrameId = requestAnimationFrame(updateYears);
  }
}

element.addEventListener("animationend", function () {
  // Esse bloco de código ("if" e "else if" a seguir) ajusta o valor de elapsedTime nos momentos finais da animação
  // para evitar inconsistências devido a pequenos desvios no tempo acumulado.
  // - O primeiro "if" garante que elapsedTime não fique abaixo de 9.938, um valor que representa
  //   o tempo mínimo necessário para que os cálculos de dilatação temporal sejam precisos e coerentes
  //   com a lógica do simulador.
  // - O "else if" assegura que elapsedTime não ultrapasse 9.999, limitando o valor ao tempo máximo
  //   definido para a animação (equivalente aos 80 anos totais no simulador).
  // Essas verificações são essenciais para manter a precisão e evitar valores de tempo fora do intervalo esperado.
  if (movingRight) {
    element.classList.remove("moveRight");
    element.classList.add("moveLeft");
    elementoGemeo1.style.transform = "rotateY(180deg)";
    movingRight = false;
  } else {
    if (elapsedTime < 9.938) {
      elapsedTime = 9.938;
      atualizarAnos(elapsedTime);
    } else if (elapsedTime > 9.999) {
      elapsedTime = 9.999;
      atualizarAnos(elapsedTime);
    }

    slider.disabled = false;
    slider.classList.remove("slider-disabled");
    startButton.style.display = "none";
    restartButton.style.display = "inline-block";
    pauseButton.style.display = "none";
    element.classList.remove("moveLeft");
    elementoGemeo1.style.transform = "rotateY(0)";
    movingRight = true;

    // Ajusta a posição final
    element.style.transform = "translateX(0)"; // Posição final
    element.classList.add("paused");
    pauseButton.blur();
    isPaused = true;
    pausedTime += Date.now() - startTime;
  }
});

function iniciarAnimacao(botao) {
  updateVelNave();
  botao.style.display = "none";
  pauseButton.style.display = "inline-block";
  restartButton.style.display = "none";
  element.classList.remove("paused");
  element.classList.add("moveRight");
  startTime = Date.now();
  pausedTime = 0;
  isPaused = false;
  updateYears();
}

function reiniciarAnimacao() {
  updateVelNave();
  startButton.style.display = "none";
  restartButton.style.display = "none";
  pauseButton.style.display = "inline-block";
  element.classList.remove("paused");
  element.classList.remove("moveLeft");
  element.classList.add("moveRight");
  element.style.transform = "translateX(0)"; // Reinicia a posição inicial
  elapsedYears = 0;
  yearsPassedGemeo1Element.textContent = `Idade do irmão: ${elapsedYears} anos`;
  yearsPassedGemeo2Element.textContent = `Idade da irmã: ${tempoDilatado} anos`;

  // Reseta os dados do gráfico
  idadeGrafico.data.labels = [];
  idadeGrafico.data.datasets[0].data = [];
  idadeGrafico.update();

  startTime = Date.now();
  pausedTime = 0;
  isPaused = false;
  updateYears();
}

function toggleAnimacao() {
  if (isPaused) {
    element.classList.remove("paused");
    pauseButton.innerHTML = "Pausar animação";
    startTime = Date.now() - pausedTime;
    pausedTime = 0; // Reseta o tempo pausado
    isPaused = false;
    updateYears(); // Atualiza os anos em exibição
  } else {
    element.classList.add("paused");
    pauseButton.innerHTML = "Continuar animação";

    // O valor fixo "15" foi adicionado como uma compensação para corrigir uma pequena discrepância
    // observada durante os ciclos de pausa e retomada da animação. Sem esse ajuste, o tempo acumulado
    // (pausedTime) às vezes apresentava um erro, fazendo com que os anos exibidos para o irmão
    // fossem reduzidos indevidamente ao retomar a animação. Esse valor empírico corrige o problema
    // e garante que a contagem de anos permaneça consistente após pausas sucessivas.
    // Nota: este valor pode variar dependendo de diferenças no hardware ou no navegador.
    pausedTime += Date.now() - startTime + 15;

    isPaused = true;
    cancelAnimationFrame(animationFrameId); // Cancela o frame da animação
  }
  pauseButton.blur(); // Remove o foco do botão
}

function visualizarMenu() {
  const menu = document.getElementById("menu");
  const sobre = document.getElementById("sobre");
  const creditos = document.getElementById("creditos");

  // Alterna entre 'flex' e 'none'
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "flex";
    sobre.style.display = "none";
    creditos.style.display = "none";
  } else {
    menu.style.display = "none";
  }
}

function visualizarSobre() {
  const menu = document.getElementById("menu");
  const sobre = document.getElementById("sobre");

  // Alterna entre 'flex' e 'none'
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "flex";
    sobre.style.display = "none";
  } else {
    menu.style.display = "none";
    sobre.style.display = "flex";
  }
}

function visualizarCreditos() {
  const menu = document.getElementById("menu");
  const creditos = document.getElementById("creditos");

  // Alterna entre 'flex' e 'none'
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "flex";
    creditos.style.display = "none";
  } else {
    menu.style.display = "none";
    creditos.style.display = "flex";
  }
}
