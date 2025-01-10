/**
 * Cyclen durch die Nachrichten implementieren, Vorlesen der Uhrzeit, Wetters etc.
 */

$(document).ready(function () {

    let temperature = 5;
    let time;
    let date;
    let intervalId = -1;

    navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}})
        .then(stream =>
            document.getElementById("camera").srcObject = stream);

    function getTime() {
        const currentTime = new Date();
        time = currentTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
        date = currentTime.toLocaleDateString('de-DE', {weekday: 'long', day: '2-digit',
            month: 'long', year: 'numeric'});
        document.getElementById("time").innerHTML = time + "<br>" + date;
    }
    setInterval(getTime,1000);
    getTime();

    function getNews() {
        if (intervalId !== -1) {
            clearInterval(intervalId);
        }
        const newsUrl = "https://www.tagesschau.de/api2u/news/?ressort=inland";
        let index = 0;
        $.getJSON(newsUrl, result => {
            const news = result.news;
            const totalNews = news.length;
            function displayNews() {
                const headline = news[index].topline;
                const caption = news[index].firstSentence;
                document.getElementById("tagesschau").innerHTML = headline + "<br>" + caption;
                index = (index + 1) % totalNews;
            }
            displayNews();
            intervalId = setInterval(displayNews, 10000);
        });
    }
    setInterval(getNews, 60*60*1000);
    getNews();

    function getWeather() {
        let lat;
        let lon;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                console.log(position)
                const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon
                    + "&appid=83d5a97742f7e91e7f0e5a2ee80e15ab&lang=de&units=metric";
                console.log(weatherUrl);
                $.getJSON(weatherUrl, result => {
                    console.log(result);
                    temperature = Math.round(result.main.temp);
                    const weather = result.weather[0].description;
                    document.getElementById("weather").innerHTML = temperature + " °C<br>" + weather;
                })
            });
        }
    }
    setInterval(getWeather,10000000);
    getWeather();

    function textToSpeech() {
        let tts = new SpeechSynthesisUtterance();
        tts.lang = "de-DE";
        tts.text = `Es ist ${date} ${time}. Die Temperatur beträgt ${temperature} Grad Celsius.`;
        speechSynthesis.speak(tts);
    }
    setTimeout(textToSpeech, 5000);

    function startUp() {
        const test = 1;
    }
});