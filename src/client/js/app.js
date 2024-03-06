import { validateAddTripForm, formErrors } from './validation';
import myImage from '../img/sky.jpg';

// Initialize once DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadTripsFromLocalStorage();

  // Show form to add a new trip
  document.getElementById('addTrip').addEventListener('click', () => {
    document.getElementById('tripForm').style.display = 'block';
    document.getElementById('tripList').style.display = 'none'; // Hide the list of trips
  });

  // Handle click event on the trip list for deletion
  document.getElementById('tripList').addEventListener('click', (e) => {
    // Search for the delete button in clicked element or ancestors
    const button = e.target.closest('.removeTrip');
    if (button !== null) {
      const tripId = parseInt(button.dataset.id, 10);

      if (!isNaN(tripId)) {
        removeTripById(tripId);
        button.closest('.trip-card').remove(); // Remove trip card from the list
      }
    }
  });

  // Toggle display of form and saved trips list
  document.getElementById('myTrips').addEventListener('click', () => {
    document.getElementById('tripForm').style.display = 'none';
    document.getElementById('tripList').style.display = 'block'; // Show the list of trips
  });

  // Handle form submission for adding a trip
  document.getElementById('tripForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default page reload

    // Collect form data
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Apply validation
    validateAddTripForm(destination, startDate, endDate);

    // Check for errors and display them
    if (formErrors.hasError) {
      document.getElementById('error-destination').textContent = formErrors.city || '';
      document.getElementById('error-startDate').textContent = formErrors.startDate || '';
      document.getElementById('error-endDate').textContent = formErrors.endDate || '';
      return; // Stop execution if there is an error
    } else {
      // Clear error messages if any
      document.getElementById('error-destination').textContent = '';
      document.getElementById('error-startDate').textContent = '';
      document.getElementById('error-endDate').textContent = '';

      // Proceed with adding the trip if no errors
      addTrip(destination, startDate, endDate).then(data => {
        if (data) {
          createTripCard(data, startDate, endDate); // Create a new trip card
        }
      });
    }
  });
});


/**
 * Loads trips from local storage and creates a card for each trip.
 * It retrieves the 'trips' array from local storage, parses it,
 * and for each trip, it creates a trip card using the `createTripCard` function.
 */
function loadTripsFromLocalStorage() {
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  trips.forEach(trip => {
    createTripCard(trip, trip.startDate, trip.endDate);
  });
}

/**
 * Adds a trip by sending trip details to a server.
 * It sends a POST request to the specified endpoint with the destination,
 * start date, and end date of the trip. Upon successful addition, it saves the trip
 * using `saveTrip` and creates a trip card for the added trip.
 * 
 * @param {string} destination The destination of the trip.
 * @param {string} startDate The start date of the trip.
 * @param {string} endDate The end date of the trip.
 * @returns {Promise<void>} A promise that resolves when the trip is added and the trip card is created.
 */
function addTrip(destination, startDate, endDate) {
  return fetch('http://localhost:3000/addTrip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ destination, startDate, endDate }),
  })
    .then(response => response.json())
    .then(data => {
      if (data) {
        const savedTripData = saveTrip(data, startDate, endDate); // Isso retorna tripData com ID
        createTripCard(savedTripData, startDate, endDate); // Passa dados salvos com ID
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/**
 * Creates and displays a card for a trip with detailed information.
 * @param {Object} tripData - The data of the trip including destination, ID, and possibly image.
 * @param {string} startDate - The start date of the trip.
 * @param {string} endDate - The end date of the trip.
 * 
 * This function calculates the duration of the trip, constructs the HTML for the trip card, 
 * and appends it to the trip list. It also hides the form and resets it post addition.
 */
function createTripCard(tripData, startDate, endDate) {
  const tripList = document.getElementById('tripList');
  const tripCard = document.createElement('div');

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  tripCard.className = 'trip-card';
  tripCard.innerHTML = `
      <div class="trip-content">
        <div class="trip-image-container">
          <img src="${tripData.image || myImage}" alt="Image of ${tripData.destination}" class="trip-image">
        </div>
        <div class="trip-info-container">
          <div class="trip-info">
            <h2 class="trip-destination">DESTINATION</h2>
            <h3>${tripData.locationInfo.name}, ${tripData.locationInfo.countryName}</h3>
          </div>
          <div class="trip-details">
            <div class="trip-start">
              <p class="trip-name">START DATE</p>
              <p class="trip-date-start">${formatDate(startDate)}</p>
            </div>
            <div class="trip-end">
              <p class="trip-name">END DATE</p>
              <p class="trip-date-end">${formatDate(endDate)}</p>
            </div>
            <div class="trip-duration">
              <p class="trip-name">DURATION</p>
              <p class="trip-duration-day">${duration} days</p>
            </div>
            <div class="trip-min-temp">
              <p class="trip-name">AVG TEMP</p>
              <p class="trip-temp">Min: ${tripData.weather?.avgMinTemp || 'N/A'}°C, Max: ${tripData.weather?.avgMaxTemp || 'N/A'}°C</p>

            </div>
            <p class="trip-forecast">${tripData.weather?.description || 'No forecast available'}</p>
          </div>
        </div>
      </div>
      <button class="trip-button removeTrip" data-id="${tripData.id}">Remove</button>
  `;

  tripList.appendChild(tripCard);
  document.getElementById('tripForm').style.display = 'none'; // Hides the form after adding
  document.getElementById('tripForm').reset(); // Resets the form after adding
}

/**
 * List of abbreviated month names.
 */
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Formats a date string into a more readable format (dd mmm, yyyy).
 * 
 * @param {string} dateStr - The date string to be formatted.
 * @returns {string} The formatted date string in the format of "dd mmm, yyyy".
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

/**
 * Saves the trip data to local storage.
 * 
 * @param {Object} tripData - The data of the trip including destination, ID, and possibly image.
 * @param {string} startDate - The start date of the trip.
 * @param {string} endDate - The end date of the trip.
 * @returns {Object} The trip data with an ID if it was not present before.
 * 
 * This function retrieves the trips from local storage, adds the new trip to the list,
 * and saves the updated list back to local storage. It also returns the trip data with an ID.
 */

function saveTrip(tripData, startDate, endDate) {
  let trips = JSON.parse(localStorage.getItem('trips') || '[]');

  const tripToSave = { ...tripData, startDate, endDate, id: tripData.id || Date.now() };
  trips.push(tripToSave);
  localStorage.setItem('trips', JSON.stringify(trips));

  return tripToSave;
}


/**
 * Removes a trip from local storage by its ID.
 * 
 * @param {number} tripId - The ID of the trip to be removed.
 * 
 * This function retrieves the trips from local storage, filters out the trip with the specified ID,
 * and saves the updated list back to local storage.
 */
function removeTripById(tripId) {
  let trips = JSON.parse(localStorage.getItem('trips') || '[]');
  const updatedTrips = trips.filter(trip => trip.id !== tripId);
  localStorage.setItem('trips', JSON.stringify(updatedTrips));
}

export { addTrip, createTripCard };