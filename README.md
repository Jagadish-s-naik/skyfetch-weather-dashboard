# 🌤️ SkyFetch - Weather Dashboard

A beautiful, interactive weather dashboard that provides real-time weather data and 5-day forecasts for any city in the world.

## ✨ Features

- 🔍 Search weather for any city worldwide
- 🌡️ Current temperature, weather conditions, and icon
- 📊 5-day weather forecast with daily predictions
- 💾 Recent searches saved locally
- 🔄 Auto-loads last searched city
- 📱 Fully responsive design
- ⚡ Fast and efficient API calls

## 🛠️ Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Axios for API calls
- OpenWeatherMap API
- localStorage for data persistence

## 🎯 Concepts Demonstrated

- Prototypal Inheritance (OOP)
- Async/Await & Promises
- Promise.all() for concurrent API calls
- DOM Manipulation
- Event Handling
- Error Handling
- localStorage API
- Responsive Web Design

## 🚀 Live Demo

[Add your Vercel URL here after deployment]

## 📸 Screenshots

[Add screenshots after deployment]

## 💻 Local Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/skyfetch-weather-dashboard.git
```

2. Navigate to project directory:
```bash
cd skyfetch-weather-dashboard
```

3. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Copy `config.example.js` to `config.js` and add your API key:
```bash
cp config.example.js config.js
```
Then edit `config.js` and replace `YOUR_API_KEY_HERE` with your actual API key.

5. Open `index.html` in your browser

## 📁 Project Structure

```
skyfetch-weather-dashboard/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── app.js              # Application logic
├── config.js           # API configuration (not tracked)
├── config.example.js   # API configuration template
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🌐 API Usage

This project uses the OpenWeatherMap API:
- Current Weather Data API
- 5-Day Weather Forecast API

Both endpoints are called concurrently using `Promise.all()` for optimal performance.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

[Jagadish S Naik]

- GitHub: [@Jagadish-s-naik]
- LinkedIn: [https://www.linkedin.com/in/jagadishnaik]

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap API](https://openweathermap.org/)
- Icons from OpenWeatherMap
- Built as part of Frontend Web Development Advanced Course
