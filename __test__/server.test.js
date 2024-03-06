const supertest = require('supertest');
const app = require('../src/server/index');

const request = supertest(app);

describe('API endpoints', () => {
  let savedTrip;

  it('should add a new trip', async () => {
    const newTrip = {
      destination: "Paris",
      startDate: "2024-02-24",
      endDate: "2024-02-26"
    };

    const response = await request.post('/addTrip').send(newTrip);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('message', 'Trip added successfully');
    savedTrip = response.body;
  });

});

