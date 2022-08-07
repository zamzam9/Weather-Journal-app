/* Global Variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=b9b9e526f9686c1a9dce4d66ac20be49&units=imperial"
const zip = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const genButton = document.getElementById('generate');
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

// Adding functionality to the button
genButton.addEventListener('click', generating);
function generating() {
  if (zip.value === "" || feelings.value === "") {
    alert('zip code and feelings are reqired.');
    return;
  } else {
      getApiData(baseURL, zip.value, apiKey)
      .then(function (data) {
        sendApiData({ date: newDate, temp: data.main.temp, feeling: feelings.value })
        .then(changUI());
      });
  }
}

// Get weather data from the API
const getApiData = async function (baseUrl, code, key) {
  const fetchWD = await fetch(baseUrl + code + key);
  try {
    const broughtData = await fetchWD.json();
    return broughtData;
  } catch (error) {
    throw error;
  }
};

// Send the data to the server
const sendApiData = async function (data = {}) {
  const postFetch = await fetch('/add', {
    method: "POST",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  try {
    const postRes = await postFetch.json();
    return postRes;
  } catch (error) {
    throw error;
  }
};

// Changing the UI
async function changUI() {
  const uiFetch = await fetch('/getData');
  try {
    const getRes = await uiFetch.json();
    document.getElementById('temp').innerHTML = 'Temperature: ' + Math.round(getRes.temp) + ' degrees';
    document.getElementById('content').innerHTML = 'Feelings: ' + getRes.feeling;
    document.getElementById('date').innerHTML = 'Date: ' + getRes.date;
  } catch (error) {
    throw error;
  }
}