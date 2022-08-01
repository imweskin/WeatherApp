const wrapper = document.querySelector(".wrapper"),
inputField = wrapper.querySelector(".input-field"),
infoText = inputField.querySelector(".info-txt"),
cityInput = inputField.querySelector("input"),
locationBtn = inputField.querySelector("button"),
weatherIcon = wrapper.querySelector("img"),
backIcon = wrapper.querySelector("header i");

let apiKey = "550ce45924ae3ba9d33b043e609f2f01";
let api;

cityInput.addEventListener("keyup", function(e) {
    if(e.key == "Enter" && cityInput.value != "") {
        requestApi(cityInput.value);
    }
});

locationBtn.addEventListener("click", function() {
    if(navigator.geolocation) { //if browser supports geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
});

backIcon.addEventListener("click", function() {
    wrapper.classList.remove("active");
});

function onSuccess(position) {
    //get lat and lon of user device from coords object
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    fetchData();
};

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add("error");
};

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchData();
};

function fetchData() {
    infoText.innerText = "Getting weather details ...";
    infoText.classList.add("pending");
    //get api response and parse it into js object then passing api result to weatherDetails function
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
};

function weatherDetails(info) {
    if(info.cod === "404") {
        infoText.innerText = `${cityInput.value} is not a valid city name`;
        infoText.classList.replace("pending","error");
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        //check conditions from https://openweathermap.org/weather-conditions
        if(id === 800) {
            weatherIcon.src = "images/clear.svg";
        } else if (id >= 200 && id <= 232){
            weatherIcon.src = "images/storm.svg";
        } else if (id >= 600 && id <= 622){
            weatherIcon.src = "images/snow.svg";
        } else if (id >= 701 && id <= 781){
            weatherIcon.src = "images/haze.svg";
        } else if (id >= 801 && id <= 804){
            weatherIcon.src = "images/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            weatherIcon.src = "images/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoText.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
};