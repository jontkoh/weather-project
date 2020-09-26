import express from 'express';
import https from 'https';
import config from './config/config';

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {

  res.sendFile("/index.html");

});

app.post("/", (req, res) => {

  const {cityName} = req.body;
  console.log(cityName);
  console.log(req.body);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${config.WEATHER_API_KEY}`;

  https.get(url, (response) => {

    response.on("data", (d) => {
      try {
        const {weather, name, weather: [{description}], weather: [{icon}], main: {temp}} = JSON.parse(d); 
        let imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        res.write('<Header><h1>Find Weather by City</h1></Header>');
        res.write("<image src='" + imageURL + "' />")
        res.write("<h2>The Current Temperature in " + name + " is " + temp + "f</h2>");
        res.send();
        } 
      catch (error) {
        res.send(cityName + " <- is not a city. Please input city with correct spelling")
      }
    });

    response.on("error", (err) => {
      console.log(err);
    });

  });
});


app.listen(3000, () => {
  console.log("listening.");
});