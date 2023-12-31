/* eslint-disable prettier/prettier */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app.js');
const Salle = require('../models/salle.js');
const { ERROR_STATUS_CODE } = require('../utils/constants.js');

let authToken;
let userId;
let spotId;
let reservationId;

describe('Reservation', () => {
  beforeAll(async () => {
    // Create a user and log in
    const userData = {
      email: 'nadiaajmaoui12@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'admin',
      role: 'CLIENT',
    };

    const createUserResponse = await request(app)
      .post('/GSalle/api/users')
      .send(userData)
      .set('Accept', 'application/json');

    expect(createUserResponse.statusCode).toEqual(200);
    expect(createUserResponse.body.message).toBe('User created successfully!');
    expect(createUserResponse.body.data.email).toBe(userData.email);

    const userCredentials = {
      email: 'nadiaajmaoui12@gmail.com',
      password: 'admin',
    };

    const loginResponse = await request(app)
      .post('/GSalle/api/auth')
      .send(userCredentials)
      .set('Accept', 'application/json');

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.ok).toBe(true);
    expect(loginResponse.body.message).toBe('User logged in successfully !');
    expect(loginResponse.body.data).toHaveProperty('accessToken');
    authToken = loginResponse.body.data.accessToken;
    userId = createUserResponse.body.data._id;

    // Create a spot
    const salleData = new Salle({
      level: '27',
      ref: '457',
      eco: true,
      description: 'Nice spot with a view',
      personNumber: 3,
      type: 'DESK',
      isAvailable: true,
    });

    const createSpotResponse = await salleData.save();
    spotId = createSpotResponse._id.toString();
  });

  // Test case for creating a new reservation
  test('should create a new reservation and return success message', async () => {
    const reservationData = {
      spotId,
      timeSlot: 'MORNING',
      reservationDate: '2023-12-11',
      status: 'PENDING',
    };

    const response = await request(app)
      .post('/GSalle/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send(reservationData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservation created successfully !');
    expect(response.body.data.spotId).toBe(reservationData.spotId);
    reservationId = response.body.data.id;
  });

  // Test case for getting all reservations
  test('should return all reservations when reservations are found', async () => {
    const response = await request(app)
      .get('/GSalle/api/reservations')
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservations returned successfully!');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test case for getting all reservations for a client
  test('should return all reservations for a client when reservations are found', async () => {
    const response = await request(app)
      .get('/GSalle/api/reservations/client')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservations returned successfully!');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('should return a reservation when the reservation is found', async () => {
    const response = await request(app)
      .get(`/GSalle/api/reservations/${reservationId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservation returned successfully!');
    expect(response.body.data.id).toBe(reservationId);
  });

  // Test case for updating a reservation
  test('should update a reservation and return success message', async () => {
    const updatedReservationData = {
      status: 'PENDING',
    };

    const response = await request(app)
      .put(`/GSalle/api/reservations/${reservationId}`)
      .send(updatedReservationData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservation updated  successfully !');
    expect(response.body.data.id).toBe(reservationId);
  });

  // Test case for updating a reservation by manager
  test('should update a reservation by manager and return success message', async () => {
    const updatedReservationData = {
      status: 'ACCEPTED',
    };

    const response = await request(app)
      .put(`/GSalle/api/reservations/manager/${reservationId}`)
      .set('Accept', 'application/json')
      .send(updatedReservationData);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservation updated  successfully !');
    expect(response.body.data.id).toBe(reservationId);
  });

  // Test case for canceling a reservation by client
  test('should cancel a reservation by client and return success message', async () => {
    const response = await request(app)
      .put(`/GSalle/api/reservations/client/${reservationId}`)
      .set('Accept', 'application/json');
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservation updated  successfully !');
    expect(response.body.data.id).toBe(reservationId);
  });

  // Test case for deleting a reservation
  test('should delete a reservation and return success message', async () => {
    const response = await request(app)
      .delete(`/GSalle/api/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Reservation deleted successfully !');
    expect(response.body.data.id).toBe(reservationId);
  });

  test('should return an error when trying to delete a non-existent reservation', async () => {
    const nonExistentReservationId = '65904f903c72e5c34edf0f9e';
    const response = await request(app)
      .delete(`/GSalle/api/reservations/${nonExistentReservationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('reservation not found ');
  });

  // Test case for updating a non-existent reservation
  test('should return an error when trying to update a non-existent reservation', async () => {
    const nonExistentReservationId = '65904f903c72e5c34edf0f9e';
    const updatedReservationData = {
      status: 'ACCEPTED',
    };

    const response = await request(app)
      .put(`/GSalle/api/reservations/${nonExistentReservationId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedReservationData);

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('reservation not found');
  });

  // Test case for deleting a non-existent reservation
  test('should return an error when trying to delete a non-existent reservation', async () => {
    const nonExistentReservationId = '65904f903c72e5c34edf0f9e';

    const response = await request(app)
      .delete(`/GSalle/api/reservations/${nonExistentReservationId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('reservation not found ');
  });

  // Test case for getting a non-existent reservation
  test('should return an error when trying to get a non-existent reservation', async () => {
    const nonExistentReservationId = '65904f903c72e5c34edf0f9e';

    const response = await request(app)
      .get(`/GSalle/api/reservations/${nonExistentReservationId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe('Reservation Not found');
  });

  // Test for unauthorized usage
  test('should return an error when an unauthorized user tries to access a protected route', async () => {
    const response = await request(app)
      .get('/GSalle/api/reservations/clients')
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(401);
  });

  // Test for unauthorized usage
  test('should return an error when an unauthorized user tries to access a protected route', async () => {
    const nonExistentReservationId2 = '65904f903c72e5c34edf0f9e';
    const response = await request(app)
      .get(`/GSalle/api/reservations/${nonExistentReservationId2}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(401);
  });

  // Test for unauthorized usage
  test('should return an error when an unauthorized user tries to access a protected route', async () => {
    const nonExistentReservationId2 = '65904f903c72e5c34edf0f9e';
    const response = await request(app)
      .delete(`/GSalle/api/reservations/${nonExistentReservationId2}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(401);
  });
  test('should return an error when creating a reservation with invalid data', async () => {
    const invalidReservationData = {
      spotId: '',
      timeSlot: '',
      reservationDate: '',
      status: '',
    };

    const response = await request(app)
      .post('/GSalle/api/reservations')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidReservationData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe('Unable to save data.');
    expect(response.body.errors).toBeDefined();
  });

  afterAll(async () => {
    if (spotId) {
      await request(app)
        .delete(`/GSalle/api/salles/${spotId}`)
        .set('Accept', 'application/json');
    }

    if (userId) {
      await request(app)
        .delete(`/GSalle/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'application/json');
    }

    if (reservationId) {
      await request(app)
        .delete(`/GSalle/api/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'application/json');
    }
  });
});
