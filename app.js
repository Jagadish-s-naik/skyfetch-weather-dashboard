// Backend endpoint that proxies requests to OpenWeatherMap.
// The actual OpenWeatherMap API key is stored and used securely on the server.
const API_URL = '/api/weather';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

function showWelcome() {
    if (!weatherDisplay) {
        return;
    }

    weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <p>Enter a city name to get started.</p>
        </div>
    `;
}

function showLoading() {
    if (!weatherDisplay) {
        return;
    }

    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner" aria-hidden="true"></div>
            <p>Loading...</p>
        </div>
    `;

    weatherDisplay.innerHTML = loadingHTML;
}

function showError(message) {
    if (!weatherDisplay) {
        return;
    }

    const errorHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;

    weatherDisplay.innerHTML = errorHTML;
}

// Function to fetch weather data
async function getWeather(city) {
    showLoading();

    if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';
    }

    const url = `${API_URL}?q=${encodeURIComponent(city)}`;

    try {
        const response = await axios.get(url);
        console.log('Weather Data:', response.data);
        displayWeather(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error);

        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
    } finally {
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
        }
    }
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    if (weatherDisplay) {
        weatherDisplay.innerHTML = weatherHTML;
    }

    if (cityInput) {
        cityInput.focus();
    }
}

function handleSearch() {
    if (!cityInput) {
        return;
    }

    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name too short.');
        return;
    }

    getWeather(city);
    cityInput.value = '';
}

if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
}

if (cityInput) {
    cityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
}

showWelcome();