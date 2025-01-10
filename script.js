/**
 * Cyclen durch die Nachrichten implementieren, Vorlesen der Uhrzeit, Wetters etc.
 */

$(document).ready(function () {

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
        $.getJSON(newsUrl, result => {
            const headline = result.news[0].topline;
            const caption = result.news[0].firstSentence;
            document.getElementById("tagesschau").innerHTML = headline + "<br>" + caption;
        })
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
            });
            const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=83d5a97742f7e91e7f0e5a2ee80e15ab&lang=de&units=metric";
            console.log(weatherUrl);
            $.getJSON(weatherUrl, result => {
                console.log(result);
                const temperature = result.main.temp + "Grad Celsius";
                const weather = result.weather[0].description;
                document.getElementById("weather").innerHTML = temperature + "<br>" + weather;
            })
        }
    }
    setInterval(getWeather,10000000);
    getWeather();

});