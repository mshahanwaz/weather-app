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
    console.log(dataAPI);
    fillDataValues(dataAPI);
  }
}

function fillDataValues(data) {
  city.innerText = data.name;
  tempValue.innerText = `${(data.main.temp - 273.1).toFixed(1)}`;
  dataValue[0].innerText = data.main.humidity;
  dataValue[1].innerText = data.main.pressure;
  dataValue[2].innerText = data.wind.speed;
}
