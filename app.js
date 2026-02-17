let apiKey = "3111ba25525dd86def4301decd81c8b6";

document.addEventListener('DOMContentLoaded', () => {
    const cityEl = document.getElementById('city');
    const tempEl = document.getElementById('temperature');
    const descEl = document.getElementById('description');
    const iconEl = document.getElementById('icon');
    const errorEl = document.getElementById('error');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const cityInput = document.getElementById('cityInput');
    const fetchBtn = document.getElementById('fetchBtn');

    function showLoading() {
        cityEl.innerText = 'Loading...';
        tempEl.innerText = '';
        descEl.innerText = '';
        iconEl.src = '';
        errorEl.innerText = '';
    }

    function showError(message) {
        cityEl.innerText = 'Error';
        tempEl.innerText = '';
        descEl.innerText = message;
        iconEl.src = '';
        errorEl.innerText = message;
    }

    function displayWeather(data) {
        if (!data || !data.main) {
            showError('Invalid data received');
            return;
        }

        cityEl.innerText = data.name || 'Unknown';
        tempEl.innerText = 'Temperature: ' + Math.round(data.main.temp) + '°C';
        const desc = data.weather && data.weather[0] && data.weather[0].description ? data.weather[0].description : '';
        descEl.innerText = 'Condition: ' + desc;

        const iconCode = data.weather && data.weather[0] && data.weather[0].icon ? data.weather[0].icon : '';
        if (iconCode) {
            iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            iconEl.alt = desc || 'weather icon';
        } else {
            iconEl.src = '';
        }
    }

    function getWeather(city) {
        // Determine API key priority: input -> stored -> file
        const keyFromInput = apiKeyInput && apiKeyInput.value ? apiKeyInput.value.trim() : null;
        const stored = localStorage.getItem('owm_api_key');
        const effectiveKey = keyFromInput || stored || apiKey;

        if (!effectiveKey || effectiveKey === 'YOUR_API_KEY_HERE') {
            showError('Set your OpenWeatherMap API key (either in the input or in app.js)');
            console.warn('OpenWeatherMap API key is missing');
            return;
        }

        // Save key if provided in input
        if (keyFromInput) localStorage.setItem('owm_api_key', keyFromInput);

        showLoading();

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(effectiveKey)}&units=metric`;

        axios.get(url)
            .then(function(response) {
                const data = response.data;
                console.log('Weather Data:', data);
                displayWeather(data);
            })
            .catch(function(error) {
                console.error('Error fetching weather:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    showError(error.response.data.message);
                } else {
                    showError('Unable to fetch weather. Check console for details.');
                }
            });
    }

    // Initial hardcoded city for Part 1

    // populate apiKeyInput with stored key if available
    const savedKey = localStorage.getItem('owm_api_key');
    if (apiKeyInput && savedKey) apiKeyInput.value = savedKey;

    // Fetch button handling
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            const city = (cityInput && cityInput.value) ? cityInput.value.trim() : 'London';
            getWeather(city || 'London');
        });
    }

    // Allow Enter key on city input
    if (cityInput) {
        cityInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const city = cityInput.value.trim() || 'London';
                getWeather(city);
            }
        });
    }

    // initial load
    getWeather('London');
});
