/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app.js');
const { ERROR_STATUS_CODE } = require('../utils/constants.js');

let userId;

describe('User Authentication and Deletion', () => {
  test('should create a user, log in, and delete the user', async () => {
    // Create a user
    const userData = {
      email: 'nadiaajmaoui123@gmail.com',
      firstName: 'HELLO',
      lastName: 'HELLO',
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

    userId = createUserResponse.body.data._id;

    // Log in
    const userCredentials = {
      email: 'nadiaajmaoui123@gmail.com',
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
  });
  // Test case for  login error
  test('login error', async () => {
    // Log in
    const userCredentials2 = {
      email: 'TEST@gmail.com',
      password: 'admin',
    };

    const loginResponse2 = await request(app)
      .post('/GSalle/api/auth')
      .send(userCredentials2)
      .set('Accept', 'application/json');

    expect(loginResponse2.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(loginResponse2.body).toEqual({
      message: 'Incorrect email or password.',
    });
  });

  afterAll(async () => {
    await request(app)
      .delete(`/GSalle/api/users/${userId}`)
      .set('Accept', 'application/json');
  });
});
