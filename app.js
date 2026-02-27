// TODO: Create WeatherApp Constructor Function
function WeatherApp(apiKey) {
    // TODO: Store the API key
    this.apiKey = apiKey;

    // TODO: Store the API URLs
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // TODO: Get references to DOM elements and store them
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    // TODO: Call init method to set up event listeners
    this.init();
}

// TODO: Create init method on prototype
WeatherApp.prototype.init = function() {
    if (this.searchBtn) {
        this.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    }

    if (this.cityInput) {
        this.cityInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        }.bind(this));
    }

    this.showWelcome();
};

// TODO: Create showWelcome method
WeatherApp.prototype.showWelcome = function() {
    if (!this.weatherDisplay) {
        return;
    }

    const welcomeHTML = `
        <div class="welcome-message">
            <h3>Welcome to Skyfetch</h3>
            <p>Enter a city name to get started.</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = welcomeHTML;
};

// TODO: Create handleSearch method
WeatherApp.prototype.handleSearch = function() {
    if (!this.cityInput) {
        return;
    }

    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        this.showError('City name too short.');
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

// TODO: Create getWeather method (async)
WeatherApp.prototype.getWeather = async function(city) {
    this.showLoading();

    if (this.searchBtn) {
        this.searchBtn.disabled = true;
        this.searchBtn.textContent = 'Searching...';
    }

    const currentWeatherUrl = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;

    try {
        const [currentWeather, forecastData] = await Promise.all([
            axios.get(currentWeatherUrl),
            this.getForecast(city)
        ]);

        this.displayWeather(currentWeather.data);
        this.displayForecast(forecastData);
    } catch (error) {
        console.error('Error:', error);

        if (error.response && error.response.status === 404) {
            this.showError('City not found. Please check spelling.');
        } else {
            this.showError('Something went wrong. Please try again.');
        }
    } finally {
        if (this.searchBtn) {
            this.searchBtn.disabled = false;
            this.searchBtn.textContent = 'Search';
        }
    }
};

// TODO: Create displayWeather method
WeatherApp.prototype.displayWeather = function(data) {
    if (!this.weatherDisplay) {
        return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = weatherHTML;

    if (this.cityInput) {
        this.cityInput.focus();
    }
};

// TODO: Create showLoading method
WeatherApp.prototype.showLoading = function() {
    if (!this.weatherDisplay) {
        return;
    }

    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner" aria-hidden="true"></div>
            <p>Loading...</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = loadingHTML;
};

// TODO: Create showError method
WeatherApp.prototype.showError = function(message) {
    if (!this.weatherDisplay) {
        return;
    }

    const errorHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = errorHTML;
};

// TODO: Create getForecast method (async)
WeatherApp.prototype.getForecast = async function(city) {
    const url = `${this.forecastUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
};

// TODO: Create processForecastData method
WeatherApp.prototype.processForecastData = function(data) {
    const dailyForecasts = data.list.filter(function(item) {
        return item.dt_txt.includes('12:00:00');
    });

    return dailyForecasts.slice(0, 5);
};

// TODO: Create displayForecast method
WeatherApp.prototype.displayForecast = function(data) {
    if (!this.weatherDisplay) {
        return;
    }

    const dailyForecasts = this.processForecastData(data);

    const forecastHTML = dailyForecasts.map(function(day) {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        return `
            <div class="forecast-card">
                <h4 class="forecast-day">${dayName}</h4>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <div class="forecast-temp">${temp}°C</div>
                <p class="forecast-desc">${description}</p>
            </div>
        `;
    }).join('');

    const forecastSection = `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;

    this.weatherDisplay.innerHTML += forecastSection;
};

// TODO: Create single instance of WeatherApp
const app = new WeatherApp('9912f2aa3f54ba082ac327ab2b83251a');