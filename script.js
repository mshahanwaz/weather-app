var city = document.querySelector(".weather__detail--city");
var toggle = document.querySelector(".weather__detail--toggle");
var toggleIcon = document.querySelector(".weather__detail--toggle i");
var toggleP = document.querySelector(".weather__detail--toggle p");
var tempValue = document.querySelector(".weather__detail--temp b");
var tempUnit = document.querySelector(".weather__detail--temp span");
var dataValue = document.querySelectorAll(".weather__detail--mainDataValue");

toggleIcon.addEventListener(
  "click",
  () => {
    if (toggleIcon.className === "bi bi-toggle-off") {
      toggleP.innerText = "F";
      toggleIcon.className = "bi bi-toggle-on";
      tempValue.innerText = `${(
        (9 * parseFloat(tempValue.innerText).toFixed(1)) / 5 +
        32
      ).toFixed(1)}`;
      tempUnit.innerText = "F";
    } else {
      toggleP.innerText = "C";
      toggleIcon.className = "bi bi-toggle-off";
      tempValue.innerText = `${(
        (5 * (parseFloat(tempValue.innerText).toFixed(1) - 32)) /
        9
      ).toFixed(1)}`;
      tempUnit.innerText = "C";
    }
  },
  false
);

var form = document.querySelector(".weather__image--search form");
var input = document.querySelector(".weather__image--search form input");

function onLoadFunc() {
  fetchAPI("delhi");
}

form.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    fetchAPI(input.value);
    input.value = "";
  },
  false
);

async function fetchAPI(value) {
  var dataAPI;
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=6f9ea8fe08d6c9cb417d588ffe552258`
  )
    .then((response) => response.json())
    .then((data) => {
      dataAPI = Object.assign({}, data);
    });
  if (dataAPI.cod === "404") {
    alert("City not found!");
  } else {
    fillDataValues(dataAPI);
    fetchAPI2(value);
  }
}

function fillDataValues(data) {
  city.innerText = data.name;
  tempValue.innerText = `${(data.main.temp - 273.1).toFixed(1)}`;
  dataValue[0].innerText = data.main.humidity;
  dataValue[1].innerText = data.main.pressure;
  dataValue[2].innerText = data.wind.speed;
}

// Graph codes
async function fetchAPI2(value) {
  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=6f9ea8fe08d6c9cb417d588ffe552258`
  )
    .then((response) => response.json())
    .then((data) => {
      makeGraph(data);
    });
}

function addDatas(data) {
  var returnValue = [];
  data.list.map((item) => {
    var date = item.dt_txt.split(" ");
    if (date[1] === "12:00:00") {
      returnValue.push((item.main.temp - 273.1).toFixed(1));
    }
  });
  return returnValue;
}

function addLabel(data) {
  var returnValue = [];
  data.list.map((item) => {
    var date = item.dt_txt.split(" ");
    if (date[1] === "12:00:00") {
      var input = date[0].split("-");
      returnValue.push(`${input[2]}-${input[1]}-${input[0]}`);
    }
  });
  return returnValue;
}

var myChart = null;

function makeGraph(dataAPI) {
  Chart.defaults.color = "#fff";
  if (myChart != null) {
    myChart.destroy();
  }
  var ctx = document.getElementById("myChart").getContext("2d");
  var labels = addLabel(dataAPI);
  var datas = addDatas(dataAPI);
  console.log(dataAPI);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Temperature(°C)",
        backgroundColor: "#005d6999",
        borderColor: "white",
        data: datas,
        fill: "start",
        tension: 0.1,
        borderWidth: 4,
        color: "#fff",
        font: {
          weight: 500,
        },
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {
      layout: {
        padding: 20,
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "5-day Weather Forecast at 12:00PM",
          font: {
            size: 17,
            family: "'Segoe UI', sans-serif",
          },
        },
      },
    },
  };

  myChart = new Chart(ctx, config);
  Chart.defaults.font.size = 12;
  Chart.defaults.font.weight = 900;
  Chart.defaults.font.family = "'Segoe UI', sans-serif";
  Chart.defaults.color = "#fff";
}
