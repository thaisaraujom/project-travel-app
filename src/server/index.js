const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

/**
 * Asynchronously retrieves location information for a given destination using the Geonames API.
 * @param {string} destination - The name of the destination to search for.
 * @returns {Promise<Object>} The first location result from the Geonames API.
 */
async function getLocationInfo(destination) {
  const username = process.env.GEONAMES_USERNAME;
  const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(destination)}&maxRows=1&username=${username}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.geonames[0]; // Returns the first result
  } catch (error) {
    console.error('Error fetching Geonames data:', error);
    throw error; // Rethrow or handle as needed
  }
}

/* Asynchronously retrieves weather information for a given location using the Weatherbit API.
  * @param {number} lat - The latitude of the location.
  * @param {number} lon - The longitude of the location.
  * @param {string} startDate - The start date of the trip.
  * @param {string} endDate - The end date of the trip.
  * @returns {Promise<Object>} The average min and max temperatures and weather description for the trip duration.
*/
async function getWeather(lat, lon, startDate, endDate) {
  const apiKey = process.env.WEATHERBIT_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    const forecasts = data.data.filter(day => {
      const dayTimestamp = new Date(day.valid_date).getTime();
      return dayTimestamp >= startTimestamp && dayTimestamp <= endTimestamp;
    });

    const tempSum = forecasts.reduce((acc, day) => {
      acc.min += day.min_temp;
      acc.max += day.max_temp;
      return acc;
    }, { min: 0, max: 0 });

    if (forecasts.length > 0) {
      const avgTemp = {
        min: Math.round(tempSum.min / forecasts.length),
        max: Math.round(tempSum.max / forecasts.length)
      };

      const description = forecasts[0].weather.description;

      return {
        avgMinTemp: avgTemp.min,
        avgMaxTemp: avgTemp.max,
        description: description
      };
    } else {
      return {
        avgMinTemp: 'N/A',
        avgMaxTemp: 'N/A',
        description: 'No forecast available'
      };
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

/**
 * Asynchronously retrieves an image for a given destination using the Pixabay API.
 * @param {string} destination - The name of the destination to search for.
 * @returns {Promise<Object>} The first image result from the Pixabay API.
*/
async function getImage(destination) {
  const apiKey = process.env.PIXABAY_API_KEY;
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(destination)}&image_type=photo&category=places`; // Correção para usar a variável corretamente
  const response = await fetch(url);
  const data = await response.json();
  return data.hits[0];
}

app.post("/forecast", async (req, res) => {
  const { destination, date } = req.body;
  let lat, lng;

  try {
    const geonamesResponse = await axios.get(
      `http://api.geonames.org/searchJSON?q=${encodeURIComponent(
        destination
      )}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`
    );

    // Verify if there is valid data
    if (geonamesResponse.data.geonames.length > 0) {
      lat = geonamesResponse.data.geonames[0].lat;
      lng = geonamesResponse.data.geonames[0].lng;
    } else {
      // If no data is found, throw an error
      throw new Error('GeoNames data not found');
    }
  } catch (error) {
    console.error("Error fetching location data:", error.message);

    lat = 0;
    lng = 0;
  }

  try {
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`
    );

    // Verify if there is valid data
    if (weatherResponse.data.data.length > 0) {
      const forecast = weatherResponse.data.data.find(day => day.valid_date === date);
      res.send(forecast);
    } else {
      // If no data is found, throw an error
      throw new Error('WeatherBit data not found');
    }
  } catch (error) {
    console.error("Error fetching weather forecast:", error.message);
    res.status(500).send("Error fetching weather forecast");
  }
});


app.post('/addTrip', async (req, res) => {
  const { destination, startDate, endDate } = req.body; // Inclua endDate aqui
  try {
    const locationInfo = await getLocationInfo(destination);

    const weather = await getWeather(locationInfo.lat, locationInfo.lng, startDate, endDate);
    const image = await getImage(destination);

    res.send({
      message: 'Trip added successfully',
      locationInfo,
      weather: weather ? weather : null,
      image: image ? image.webformatURL : null,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to add trip' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;