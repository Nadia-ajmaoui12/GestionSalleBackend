/* eslint-disable prettier/prettier */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app.js');
const User = require('../models/user');
const { ERROR_STATUS_CODE } = require('../utils/constants.js');

describe('User Controller', () => {
  // Clean database Before Test
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });
  // Test case for creating a new user
  test('should create a new user and return success message', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'testpassword',
      role: 'CLIENT',
    };

    const response = await request(app)
      .post('/GSalle/api/users')
      .send(userData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('User created successfully!');
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.firstName).toBe(userData.firstName);
    expect(response.body.data.lastName).toBe(userData.lastName);
    expect(response.body.data.password).toBe(userData.password);
    expect(response.body.data.role).toBe(userData.role);
  });

  // Test case for getting all users
  test('should return all users when users are found', async () => {
    const response = await request(app)
      .get('/GSalle/api/users')
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Users returned successfully!');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test case for getting all clients
  test('should return all clients with last reservation', async () => {
    const response = await request(app)
      .get('/GSalle/api/users/clients')
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe(
      'Clients with last reservation returned successfully!',
    );
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('should return a user when the user is found', async () => {
    const userData = new User({
      email: 'testForId@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'testpassword',
      role: 'CLIENT',
    });

    await userData.save();
    const userId = userData._id.toString();
    const response = await request(app)
      .get(`/GSalle/api/users/${userId}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('User returned successfully !');
    expect(response.body.data._id).toBe(userId._id);
  });

  // Test case for updating a user
  test('should update a user and return success message', async () => {
    const userToUpdate = new User({
      email: 'updated-email@example.com',
      password: 'tessst',
      firstName: 'Updated',
      lastName: 'User',
      role: 'CLIENT',
    });

    await userToUpdate.save();

    const updatedUser = new User({
      email: 'TestSuccessUpdate@example.com',
      firstName: 'Updated',
      lastName: 'User',
      role: 'CLIENT',
    });

    const userToUpdateId = userToUpdate._id.toString();
    const response = await request(app)
      .put(`/GSalle/api/users/${userToUpdateId}`)
      .send(updatedUser)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('User updated  successfully !');
    expect(response.body.data._id).toBe(userToUpdateId._id);
  });

  // Test case for deleting a user
  test('should delete a user and return success message', async () => {
    const userToDelete = new User({
      email: 'deleted-email@example.com',
      password: 'tessst',
      firstName: 'Updated',
      lastName: 'User',
      role: 'CLIENT',
    });

    await userToDelete.save();

    const userToDeleteId = userToDelete._id.toString();
    const response = await request(app)
      .delete(`/GSalle/api/users/${userToDeleteId}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('user deleted successfully !');
    expect(response.body.data._id).toBe(userToDeleteId._id);
  });
  // Test case for getting a non-existent user
  test('should return an error when trying to get a non-existent user', async () => {
    const nonExistantUser = '65904f903c72e5c34edf0f9e';

    const response = await request(app)
      .get(`/GSalle/api/users/${nonExistantUser}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('User Not found');
  });

  // Test case for updating a non-existent user
  test('should return an error when trying to update a non-existent user', async () => {
    const nonExistantUser = '65904f903c72e5c34edf0f9e';
    const updatedUserData = {
      firstName: 'HELLOTEST',
    };

    const response = await request(app)
      .put(`/GSalle/api/users/${nonExistantUser}`)
      .set('Accept', 'application/json')
      .send(updatedUserData);

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('user not found');
  });

  // Test case for gettin a non-existent user
  test('should return an error when trying to get a non-existent user', async () => {
    const nonExistantUser = '65904f903c72e5c34edf0f9e';

    const response = await request(app)
      .get(`/GSalle/api/users/${nonExistantUser}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('User Not found');
  });
  test('should return an error when creating a user with invalid data', async () => {
    const invalidUserData = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: '',
    };

    const response = await request(app)
      .post('/GSalle/api/users')
      .send(invalidUserData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.data).toBeNull();
  });
  test('should return an error when creating a user with a duplicate email', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'testpassword',
      role: 'CLIENT',
    };

    // Create the first user
    await request(app)
      .post('/GSalle/api/users')
      .send(userData)
      .set('Accept', 'application/json');

    // Attempt to create another user with the same email
    const response = await request(app)
      .post('/GSalle/api/users')
      .send(userData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('Unable to save user data.');
  });

  // Test case for handling an error when creating a new user
  test('should handle error when unable to save user data', async () => {
    jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const userData = {
      email: 'error@example.com',
      firstName: 'Error',
      lastName: 'User',
      password: 'testpassword',
      role: 'CLIENT',
    };

    const response = await request(app)
      .post('/GSalle/api/users')
      .send(userData)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(ERROR_STATUS_CODE);
    expect(response.body.message).toBe('Unable to save user data.');
    expect(response.body.data).toBeNull();

    User.prototype.save.mockRestore();
  });
});
