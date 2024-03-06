/**
 * Object to store form validation errors and a flag indicating if there are any errors.
 */
export const formErrors = {
  city: '',
  startDate: '',
  endDate: '',
  hasError: false,
};

/**
 * Validates the trip addition form inputs for city name, start date, and end date.
 * Updates the `formErrors` object with specific error messages for each field if validation fails.
 * 
 * @param {string} cityName - The name of the destination city.
 * @param {string} startDate - The start date of the trip.
 * @param {string} endDate - The end date of the trip.
 */
export const validateAddTripForm = (cityName, startDate, endDate) => {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  // Reset errors
  formErrors.city = '';
  formErrors.startDate = '';
  formErrors.endDate = '';
  formErrors.hasError = false;

  // Validate city name
  if (!cityName.trim()) {
    formErrors.city = 'Destination City is required';
    formErrors.hasError = true;
  }

  // Validate start date
  if (!startDate) {
    formErrors.startDate = 'Trip Start Date is required';
    formErrors.hasError = true;
  }

  // Validate end date
  if (!endDate) {
    formErrors.endDate = 'Trip End Date is required';
    formErrors.hasError = true;
  }

  // Validate dates against current date and each other
  if (startDate && endDate) {
    const startDateObj = new Date(startDate);
    startDateObj.setUTCHours(0, 0, 0, 0);

    const endDateObj = new Date(endDate);
    endDateObj.setUTCHours(0, 0, 0, 0);

    if (startDateObj < currentDate) {
      formErrors.startDate = 'Trip Start Date should be a future date';
      formErrors.hasError = true;
    }

    if (endDateObj < startDateObj) {
      formErrors.endDate = 'Trip End Date should not be before the Trip Start Date';
      formErrors.hasError = true;
    }
  }
};
