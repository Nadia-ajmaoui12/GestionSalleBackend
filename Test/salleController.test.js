/* eslint-disable prettier/prettier */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const request = require('supertest');
const server = require('../app.js');
const Salle = require('../models/salle.js');
require('../utils/constants.js');

const app = request(server);

describe('Salle Controller', () => {
  // Clean database Before Test
  beforeAll(async () => {
    await Salle.deleteMany({});
  });

  afterAll(async () => {
    await Salle.deleteMany({});
  });

  test('should create a new salle and return success message', async () => {
    const salleData = {
      level: '27',
      ref: '45',
      eco: true,
      description: 'Nice spot with a view',
      personNumber: 3,
      type: 'DESK',
      isAvailable: true,
    };

    const response = await app
      .post('/GSalle/api/salles')
      .send(salleData)
      .set('Accept', 'application/json');

    // Update the expectation to match the correct status code (200)
    expect(response.statusCode).toEqual(200);

    expect(response.body.message).toBe('Spot  saved successfully !');
    const createdSalle = await Salle.findOne({ ref: '45' });
    expect(createdSalle).toBeTruthy();

    expect(createdSalle.description).toBe('Nice spot with a view');
  });

  // Test for getAllSalles
  describe('getAllSalles', () => {
    test('should return all spots when spots are found', async () => {
      const response = await app.get('/GSalle/api/salles');

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('spots returned successfully !');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return an empty array when no spots are found', async () => {
      await Salle.deleteMany({});
      const response = await app.get('/GSalle/api/salles');

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('spots returned successfully !');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });
  });
  // Test getSalleById
  describe('getSalleById', () => {
    test('should return a spot when the spot is found', async () => {
      const spot = new Salle({
        level: '78',
        ref: 'B1',
        eco: false,
        description: 'Another nice spot',
        personNumber: 2,
        type: 'DESK',
        isAvailable: true,
      });
      await spot.save();

      const response = await app.get(`/GSalle/api/salles/${spot._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Spot  returned successfully !');
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data.level).toBe('78');
    });

    test('should return an error when the spot is not found', async () => {
      const invalidSpotId = '60a5facc1c9d440000000000';

      const response = await app.get(`/GSalle/api/salles/${invalidSpotId}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Spot Not found');
    });
  });

  // Test for deleteSalle
  describe('deleteSpot', () => {
    test('should delete a spot and return success message', async () => {
      const salle = new Salle({
        level: '41',
        ref: 'C3',
        eco: true,
        description: 'Salle to be deleted',
        personNumber: 4,
        type: 'DESK',
        isAvailable: true,
      });
      await salle.save();

      const response = await app.delete(`/GSalle/api/salles/${salle._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Spot deleted successfully!');
    });

    test('should return an error when the spot is not found', async () => {
      const invalidSpotId = '60a5facc1c9d440000000000';

      const response = await app.delete(`/GSalle/api/salles/${invalidSpotId}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Spot not found');
    });
  });

  // Test for GetAvailableSalles
  describe('getAvailableSalles', () => {
    test('should return available salles for the specified date and spot type', async () => {
      const salle = new Salle({
        level: '61',
        ref: '2002',
        eco: true,
        description: 'Spot to be updated',
        personNumber: 4,
        type: 'DESK',
        isAvailable: true,
      });
      await salle.save();
      const response = await app.get(
        '/GSalle/api/salles/availableSalles/2024-12-17/DESK',
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(
        'Available spots returned successfully!',
      );
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return an empty array when no spots are available for the specified date and spot type', async () => {
      await Salle.deleteMany({});

      const response = await app.get(
        '/GSalle/api/salles/availableSalles/2024-12-17/DESK',
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(
        'Available spots returned successfully!',
      );
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });
  });
  // Test for updateSalle
  describe('updateSalle', () => {
    test('should update a spot and return success message', async () => {
      const salleToUpdate = new Salle({
        level: '50',
        ref: 'U1',
        eco: true,
        description: 'Spot to be updated',
        personNumber: 2,
        type: 'DESK',
        isAvailable: true,
      });

      await salleToUpdate.save();

      const updatedSalleData = {
        level: '55',
        ref: 'u7',
        eco: false,
        description: 'Updated spot description',
        personNumber: 3,
        type: 'DESK',
        isAvailable: false,
      };
      const response = await app
        .put(`/GSalle/api/salles/${salleToUpdate._id.toString()}`)
        .send(updatedSalleData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Spot updated  successfully !');

      const updatedSalle = await Salle.findById(salleToUpdate._id);
      expect(updatedSalle.level).toBe(updatedSalleData.level);
      expect(updatedSalle.ref).toBe(updatedSalleData.ref);
      expect(updatedSalle.eco).toBe(updatedSalleData.eco);
      expect(updatedSalle.description).toBe(updatedSalleData.description);
      expect(updatedSalle.type).toBe(updatedSalleData.type);
      expect(updatedSalle.isAvailable).toBe(updatedSalleData.isAvailable);
      expect(updatedSalle.personNumber).toBe(updatedSalleData.personNumber);
    });

    test('should return an error when trying to update a non-existent spot', async () => {
      const invalidSalleId = '60a5facc1c9d440000000000';

      const response = await app
        .put(`/GSalle/api/salles/${invalidSalleId}`)
        .send({
          level: '55',
          ref: 'U1',
          eco: false,
          description: 'Updated spot description',
          personNumber: 3,
          type: 'MEETING_ROOM',
          isAvailable: false,
        })
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('spot not found');
    });
  });

  // Test case for getting available salles
  test('should return available salles for the specified date and spot type', async () => {
    const salle = new Salle({
      level: '61',
      ref: '20042',
      eco: true,
      description: 'Spot to be updated',
      personNumber: 4,
      type: 'DESK',
      isAvailable: true,
    });
    await salle.save();

    const response = await app.get(
      '/GSalle/api/salles/availableSalles/2024-12-17/DESK',
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      'Available spots returned successfully!',
    );
    expect(response.body.data.length).toBeGreaterThan(0);
  });
  // Test case for getting available salles
  test('should return available salles for the specified date and spot type', async () => {
    const salle = new Salle({
      level: '61',
      ref: '20042',
      eco: true,
      description: 'Spot to be updated',
      personNumber: 4,
      type: 'DESK',
      isAvailable: true,
    });
    await salle.save();

    const response = await app.get(
      '/GSalle/api/salles/availableSalles/2024-12-17/DESK',
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      'Available spots returned successfully!',
    );
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test case for getting available salles when no spots are available
  test('should return an empty array when no spots are available for the specified date and spot type', async () => {
    await Salle.deleteMany({});

    const response = await app.get(
      '/GSalle/api/salles/availableSalles/2024-12-17/DESK',
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      'Available spots returned successfully!',
    );
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(0);
  });
  // invalid Data
  test('should return an error for invalid salle data', async () => {
    const invalidSalleData = {
      level: '',
      ref: '',
      eco: false,
      description: '',
      personNumber: 2,
      type: '',
      isAvailable: true,
    };

    const response = await app
      .post('/GSalle/api/salles')
      .send(invalidSalleData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(500);
  });

  // Test case for getting available salles when no spots are available
  test('should return an empty array when no spots are available for the specified date and spot type', async () => {
    await Salle.deleteMany({});

    const response = await app.get(
      '/GSalle/api/salles/availableSalles/2024-12-17/DESK',
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      'Available spots returned successfully!',
    );
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(0);
  });
  test('should return an error when trying to update a non-existent spot', async () => {
    // Define an invalid salle ID
    const invalidSalleId = '60a5facc1c9d440000000000';

    // Perform the update request with invalid ID
    const response = await app
      .put(`/GSalle/api/salles/${invalidSalleId}`)
      .send({
        level: '55',
        ref: 'U1',
        eco: false,
        description: 'Updated spot description',
        personNumber: 3,
        type: 'MEETING_ROOM',
        isAvailable: false,
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('spot not found');
  });
});
