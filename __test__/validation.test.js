// validation.test.js
import { validateAddTripForm, formErrors } from '../src/client/js/validation';
describe('validateAddTripForm', () => {
  beforeEach(() => {
    // Limpa os erros antes de cada teste
    formErrors.city = '';
    formErrors.startDate = '';
    formErrors.endDate = '';
    formErrors.hasError = false;
  });

  test('should flag an error if the end date is before the start date', () => {
    const city = 'New York';
    const startDate = '2023-01-10';
    const endDate = '2023-01-05'; // End date before start date

    validateAddTripForm(city, startDate, endDate);

    expect(formErrors.hasError).toBe(true);
    expect(formErrors.endDate).toBe('Trip End Date should not be before the Trip Start Date');
  });

  test('should not flag an error if the start date is before the end date', () => {
    const city = 'Paris';
    const startDate = '2023-01-05';
    const endDate = '2023-01-10'; // Valid start and end dates

    validateAddTripForm(city, startDate, endDate);
  });

});
