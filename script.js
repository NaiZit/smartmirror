/**
 * Cyclen durch die Nachrichten implementieren, Vorlesen der Uhrzeit, Wetters etc.
 */

$(document).ready(function () {

    let temperature;

    navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}})
        .then(stream =>
            document.getElementById("camera").srcObject = stream);

    function getTime() {
        const currentTime = new Date();
        const time = currentTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
        const date = currentTime.toLocaleDateString('de-DE', {weekday: 'long', day: '2-digit',
            month: 'long', year: 'numeric'});
        document.getElementById("time").innerHTML = time + "<br>" + date;
    }
    setInterval(getTime,1000);
    getTime();

    function getNews() {
        const newsUrl = "https://www.tagesschau.de/api2u/news/?ressort=inland";
        let index = 0;
        if (intervalId) {
            clearInterval(intervalId);
        }
        $.getJSON(newsUrl, result => {
            const news = result.news;
            const totalNews = newsArray.length;
            function displayNews() {
                const headline = news[index].topline;
                const caption = news[index].firstSentence;
                document.getElementById("tagesschau").innerHTML = headline + "<br>" + caption;
                index = (index + 1) % totalNews;
            }
            displayNews();
            intervalId = setInterval(displayNews, 15000);
            console.log("Neues Intervall gestartet.");
        });
    }
    setInterval(getNews, 1000000);
    getNews();

    function getWeather() {
        var lat;
        var lon;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                console.log(position)
                const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=83d5a97742f7e91e7f0e5a2ee80e15ab&lang=de&units=metric";
                console.log(weatherUrl);
                $.getJSON(weatherUrl, result => {
                    console.log(result);
                    temperature = Math.round(result.main.temp);
                    const weather = result.weather[0].description;
                    document.getElementById("weather").innerHTML = temperature + "°C<br>" + weather;
                })
            });
        }
    }
    setInterval(getWeather,10000000);
    getWeather();

    function textToSpeech() {
        var tts = new SpeechSynthesisUtterance();
        tts.lang = "de-DE";
        tts.text = `Es ist {date and time}. Die Temperatur beträgt {temperature} Grad Celsius. `
    }

    function startUp() {
        const test = 1;
    }



});