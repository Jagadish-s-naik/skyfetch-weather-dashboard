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
    
    // TODO: Add new DOM references
    this.recentSearchesSection = document.getElementById('recent-searches-section');
    this.recentSearchesContainer = document.getElementById('recent-searches-container');
    
    // TODO: Initialize recent searches array
    this.recentSearches = [];
    
    // TODO: Set maximum number of recent searches to save
    this.maxRecentSearches = 5;

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
    
    // TODO: Add clear history button listener
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', this.clearHistory.bind(this));
    }
    
    // TODO: Load recent searches from localStorage
    this.loadRecentSearches();
    
    // TODO: Load last searched city
    this.loadLastCity();
};

// TODO: Create showWelcome method
WeatherApp.prototype.showWelcome = function() {
    if (!this.weatherDisplay) {
        return;
    }

    const welcomeHTML = `
        <div class="welcome-message">
            <h3>🌤️ Welcome to Skyfetch</h3>
            <p>Enter a city name to get started.</p>
            <p style="font-size: 0.9rem; color: #999; margin-top: 10px;">Try: London, Paris, Tokyo</p>
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
        
        // TODO: Save this successful search to recent searches
        this.saveRecentSearch(city);
        
        // TODO: Save as last searched city
        localStorage.setItem('lastCity', city);
        
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

// TODO: Create loadRecentSearches method
WeatherApp.prototype.loadRecentSearches = function() {
    // TODO: Get recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    
    // TODO: If data exists, parse it and store in this.recentSearches
    if (saved) {
        this.recentSearches = JSON.parse(saved);
    }
    
    // TODO: Display the recent searches
    this.displayRecentSearches();
};

// TODO: Create saveRecentSearch method
WeatherApp.prototype.saveRecentSearch = function(city) {
    // TODO: Convert city to title case for consistency
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    
    // TODO: Check if city already exists in array
    // Remove it if it does (we'll add it to the front)
    const index = this.recentSearches.indexOf(cityName);
    if (index > -1) {
        this.recentSearches.splice(index, 1);
    }
    
    // TODO: Add city to the beginning of array
    this.recentSearches.unshift(cityName);
    
    // TODO: Keep only the last 5 searches
    if (this.recentSearches.length > this.maxRecentSearches) {
        this.recentSearches.pop(); // Remove last item
    }
    
    // TODO: Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    
    // TODO: Update display
    this.displayRecentSearches();
};

// TODO: Create displayRecentSearches method
WeatherApp.prototype.displayRecentSearches = function() {
    if (!this.recentSearchesContainer || !this.recentSearchesSection) {
        return;
    }
    
    // TODO: Clear existing buttons
    this.recentSearchesContainer.innerHTML = '';
    
    // TODO: If no recent searches, hide the section
    if (this.recentSearches.length === 0) {
        this.recentSearchesSection.style.display = 'none';
        return;
    }
    
    // TODO: Show the section
    this.recentSearchesSection.style.display = 'block';
    
    // TODO: Create a button for each recent search
    this.recentSearches.forEach(function(city) {
        const btn = document.createElement('button');
        btn.className = 'recent-search-btn';
        btn.textContent = city;
        
        // TODO: Add click handler (use .bind(this)!)
        btn.addEventListener('click', function() {
            this.cityInput.value = city;
            this.getWeather(city);
        }.bind(this));
        
        this.recentSearchesContainer.appendChild(btn);
    }.bind(this));
};

// TODO: Create loadLastCity method
WeatherApp.prototype.loadLastCity = function() {
    // TODO: Get last city from localStorage
    const lastCity = localStorage.getItem('lastCity');
    
    // TODO: If exists, fetch weather for that city
    if (lastCity) {
        this.getWeather(lastCity);
    } else {
        // TODO: Show welcome message if no last city
        this.showWelcome();
    }
};

// TODO: Create clearHistory method
WeatherApp.prototype.clearHistory = function() {
    // TODO: Confirm with user
    if (confirm('Clear all recent searches?')) {
        this.recentSearches = [];
        localStorage.removeItem('recentSearches');
        this.displayRecentSearches();
    }
};

// TODO: Create single instance of WeatherApp
const app = new WeatherApp('9912f2aa3f54ba082ac327ab2b83251a');