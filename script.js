/**
 * Cyclen durch die Nachrichten implementieren, Vorlesen der Uhrzeit, Wetters etc.
 */

$(document).ready(function () {

    let temperature = 5;
    let time;
    let date;
    let intervalId = -1;

    startUp();


    function startUp() {
        getCamera();
        enableTTS();
        setInterval(getWeather,60*60*1000);
        getWeather();
        setInterval(getNews, 60*60*1000);
        getNews();
        setInterval(getTime,750);
        getTime();
    }

    function getCamera() {
        navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}, audio: false})
            .then(stream =>
                document.getElementById("camera").srcObject = stream);
    }

    function getTime() {
        const currentTime = new Date();
        time = currentTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
        date = currentTime.toLocaleDateString('de-DE', {weekday: 'long', day: '2-digit',
            month: 'long', year: 'numeric'});
        document.getElementById("time").innerHTML = time + "<br>" + date;
    }

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
                document.getElementById("headline").innerHTML = headline;
                document.getElementById("caption").innerHTML = caption;
                index = (index + 1) % totalNews;
            }
            displayNews();
            intervalId = setInterval(displayNews, 20000);
        });
    }

    function getWeather() {
        let lat;
        let lon;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon
                    + "&appid=83d5a97742f7e91e7f0e5a2ee80e15ab&lang=de&units=metric";
                $.getJSON(weatherUrl, result => {
                    temperature = Math.round(result.main.temp);
                    const weather = result.weather[0].description;
                    document.getElementById("weather").innerHTML = temperature + "°C<br>" + weather;
                })
            });
        }
    }

    document.getElementById("weather").innerHTML = "10°C<br>Bewölkt";

    function textToSpeech() {
        let tts = new SpeechSynthesisUtterance();
        tts.lang = "de-DE";
        tts.text = `Es ist ${date} ${time}. Die Temperatur beträgt ${temperature} Grad Celsius.`;
        speechSynthesis.speak(tts);
    }

    /**
     * Needed to get the SpeechSynthesis to work on iOS devices.
     */
    function enableTTS() {
        document.getElementById("enablevoice").addEventListener("click", function() {
            textToSpeech();
            setInterval(textToSpeech, 60000);
            document.getElementById("enablevoice").style.display = "none";
        });
    }
});