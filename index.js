require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', (req, res) => {
  res.send(`Hello from my web server! Click <a href="/api/hello?visitor_name=Mark">here</a> to get started!`);
});

app.get('/api/hello', async (req, res) => {
  try {
    const visitorName = req.query.visitor_name || 'Guest';
    // Log the visitor name
    console.log(`Visitor Name: ${visitorName}`);

    const locationResponse = await axios.get('https://ipapi.co/json/');
    if (locationResponse.status !== 200) {
      throw new Error('Failed to get client IP address');
    }
    const clientIp = locationResponse.data.ip;
    const location = locationResponse.data.city || 'Unknown location';
    // Log the location data
    console.log(`Client IP: ${clientIp}`);
    console.log(`Location: ${location}`);


    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not set');
    }

    // Fetch weather data
    console.log(`Fetching weather data for Location: ${location}`);
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
    if (weatherResponse.status !== 200) {
      throw new Error('Failed to get weather data');
    }
    const temperature = weatherResponse.data.main.temp;
    // Log the temperature
    console.log(`Temperature: ${temperature}`);

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature.toFixed(2)} degrees Celsius in ${location}.`
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
