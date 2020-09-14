// HTML elements
const place = document.querySelector('.location');
const today = document.querySelector('.date');
const status = document.querySelector('.status');
const day = document.querySelector('.day');
const temperature = document.querySelector('.temp');
const minMax = document.querySelector('.min-max');
const min = document.querySelector('.min');
const max = document.querySelector('.max');

// API
const api = {
    apiKEY: '6fddf4d87bb9cddb7afbbf2fad3fd317',
    proxy: 'https://cors-anywhere.herokuapp.com/'
};

// Determine today`s date
function findDate() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    today.innerHTML = `${day}. ${month} ${year}.`;
};

// Find location using navigation
function findLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude.toFixed(2);
        const lon = pos.coords.longitude.toFixed(2);
        
        fetch(`${api.proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.apiKEY}`)
            .then(res => res.json())
            .then(data => {
                // Data variables
                const main = data.main;
                const weather = data.weather[0];
                const tempUI = main.temp.toFixed(0);
                const minC = main.temp_min.toFixed(0);
                const maxC = main.temp_max.toFixed(0);

                // Display UI values
                place.innerHTML = `${data.name}`;
                status.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
                temperature.innerHTML = tempUI;
                min.innerHTML = minC;
                max.innerHTML = maxC;
                
                // Determining the icon
                const iconID = weather.icon;
                const iconURL = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
            
                day.setAttribute('src', iconURL);

                // Change temperature unit
                const unit = document.querySelector('.unit');
                const fahrenheit = ((tempUI * 1.8) + 32).toFixed(0);

                unit.addEventListener('click', () => {
                    if(unit.textContent === 'c') {
                        unit.textContent = 'f';
                        temperature.innerHTML = `${fahrenheit}`;
                        minMax.innerHTML = `
                            <span class="min">${((minC * 1.8) + 32).toFixed(0)}</span><span>&#176;</span>c
                            /
                            <span class="max">${((maxC * 1.8) + 32).toFixed(0)}</span><span>&#176;</span>c
                        `;
                    } else if(unit.textContent === 'f') {
                        unit.textContent = 'c';
                        temperature.innerHTML = `${tempUI}`;
                        minMax.innerHTML = `
                            <span class="min">${minC}</span><span>&#176;</span>c
                            /
                            <span class="max">${maxC}</span><span>&#176;</span>c
                        `;
                    };
                });
            });
    });
};

// Event listener
window.addEventListener('load', () => {
    findDate();
    findLocation();
});