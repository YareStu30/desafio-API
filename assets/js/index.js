let inputAmount = document.querySelector("#inputAmount");
let selectTypeMoney = document.querySelector("#selectTypeMoney");
let button = document.querySelector("#button");
let dataArray = [];
let myChart = null;
let lastchange = 0;

async function ConectionServer() {
  try {
    currency = selectTypeMoney.value;

    const res = await fetch(`https://mindicador.cl/api/${currency}`);
    const data = await res.json();
    console.log(res.status);

    lastchange = data.serie[0].valor;
    let test = data.serie;

    calculo();

    dataArray = data.serie.slice(0, 10);
    const datChange = dataArray.map((x) => x.valor);
    const datLabel = dataArray.map((x) => x.fecha);
    chartRender(datLabel, datChange);
    document.querySelector("#error").innerHTML =
      "Mensaje del Servidor: conexión realizada con éxito";
  } catch (e) {
    document.querySelector("#error").innerHTML =
      "Mensaje del Servidor: No se pudo encontrar el dato";
    document.querySelector("#resultado").innerHTML = "....";
  }
}

//grafico*
function chartRender(datLabel, datChange) {
  const ctx = document.getElementById("myChart").getContext("2d");
  if (myChart != null) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: datLabel.reverse(),
      datasets: [
        {
          label: `Valor: ${currency.toUpperCase()}`,
          data: datChange.reverse(),
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          beginAtZero: true,
        },
      },
    },
  });
}

function calculo() {
  let resultado = Number((inputAmount.value / lastchange).toFixed(2));

  document.querySelector("#resultado").innerHTML = "Resultado  :  " + resultado;
}

button.addEventListener("click", () => {
  if (inputAmount.value == "") {
    alert("Debe ingresar un valor");
    return;
  }

  if (isNaN(inputAmount.value)) {
    alert("Solo puedes ingresar valores numéricos en la cantidad a convertir");
    return;
  }

  ConectionServer();
});
