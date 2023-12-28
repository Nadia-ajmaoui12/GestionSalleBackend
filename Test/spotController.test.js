/* eslint-disable prettier/prettier */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');
const Spot = require('../models/spot.js');
const { describe, it, before, after } = require('mocha');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Spot Controller', () => {
  // Clean database Before Test
  before(async () => {
    await Spot.deleteMany({});
  });

  after(async () => {
    await Spot.deleteMany({});
  });

  describe('createSpot', () => {
    it('should create a new spot and return success message', async () => {
      const spotData = {
        level: 27,
        ref: '45',
        eco: true,
        description: 'Nice spot with a view',
        personNumber: 3,
        type: 'DESK',
        isAvailable: true,
      };

      const response = await chai
        .request(app)
        .post('/GSalle/api/spots')
        .send(spotData);

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('Spot  saved successfully !');
      const createdSpot = await Spot.findOne({ ref: '45' });
      expect(createdSpot).to.exist;
      expect(createdSpot.level).to.equal('27');
      expect(createdSpot.description).to.equal('Nice spot with a view');
    });

    it('should return an error when data is missing or invalid', async () => {
      const invalidSpotData = {
        // Invalid data with missing 'ref'
        level: 27,
        eco: true,
        description: 'Invalid spot data',
        personNumber: 3,
        type: 'DESK',
        isAvailable: true,
      };

      const response = await chai
        .request(app)
        .post('/GSalle/api/spots')
        .send(invalidSpotData);

      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('Unable to save data.');
    });

    it('should return an error for duplicate spot reference', async () => {
      const spotData = {
        level: 30,
        ref: 'A27', // Duplicate reference
        eco: true,
        description: 'Another spot with the same reference',
        personNumber: 2,
        type: 'DESK',
        isAvailable: true,
      };

      const response = await chai
        .request(app)
        .post('/GSalle/api/spots')
        .send(spotData);

      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('Unable to save data.');
    });
  });

  describe('getAllSpots', () => {
    it('should return all spots when spots are found', async () => {
      const response = await chai.request(app).get('/GSalle/api/spots');

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('spots returned successfully !');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
    });

    it('should return an empty array when no spots are found', async () => {
      await Spot.deleteMany({});
      const response = await chai.request(app).get('/GSalle/api/spots');

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('spots returned successfully !');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.equal(0);
    });
  });

  describe('getSpotById', () => {
    it('should return a spot when the spot is found', async () => {
      const spot = new Spot({
        level: 78,
        ref: 'B1',
        eco: false,
        description: 'Another nice spot',
        personNumber: 2,
        type: 'DESK',
        isAvailable: true,
      });
      await spot.save();

      const response = await chai
        .request(app)
        .get(`/GSalle/api/spots/${spot._id}`);

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('Spot  returned successfully !');
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.level).to.equal('78');
    });

    it('should return an error when the spot is not found', async () => {
      const invalidSpotId = '60a5facc1c9d440000000000';

      const response = await chai
        .request(app)
        .get(`/GSalle/api/spots/${invalidSpotId}`);

      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('Spot Not found');
    });
  });

  describe('deleteSpot', () => {
    it('should delete a spot and return success message', async () => {
      const spot = new Spot({
        level: 41,
        ref: 'C3',
        eco: true,
        description: 'Spot to be deleted',
        personNumber: 4,
        type: 'DESK',
        isAvailable: true,
      });
      await spot.save();

      const response = await chai
        .request(app)
        .delete(`/GSalle/api/spots/${spot._id}`);

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('Spot deleted successfully!');
    });

    it('should return an error when the spot is not found', async () => {
      const invalidSpotId = '60a5facc1c9d440000000000';

      const response = await chai
        .request(app)
        .delete(`/GSalle/api/spots/${invalidSpotId}`);

      expect(response).to.have.status(400);
      expect(response.body.message).to.equal('Spot not found');
    });
  });

  // describe('updateSpot', () => {
  //   it('should update a spot and return success message', async () => {
  //     const spot = new Spot({
  //       level: 61,
  //       ref: 'D4',
  //       eco: true,
  //       description: 'Spot to be updated',
  //       personNumber: 4,
  //       type: 'DESK',
  //       isAvailable: true,
  //     });
  //     await spot.save();

  //     const updatedSpotData = {
  //       level: 77,
  //       description: 'Updated spot description',
  //     };

  //     const response = await chai
  //       .request(app)
  //       .put(`/GSalle/api/spots/${spot._id}`)
  //       .send(updatedSpotData);

  //     expect(response).to.have.status(200);
  //     expect(response.body.message).to.equal('Spot updated  successfully !');
  //     expect(response.body.data.level).to.equal('77');
  //     expect(response.body.data.description).to.equal(
  //       'Updated spot description',
  //     );
  //   });

  //   it('should return an error when the spot is not found', async () => {
  //     const invalidSpotId = '60a5facc1c9d440000000000';

  //     const response = await chai
  //       .request(app)
  //       .put(`/GSalle/api/spots/${invalidSpotId}`)
  //       .send({ level: 2 });

  //     expect(response).to.have.status(400);
  //     expect(response.body.message).to.equal('spot not found');
  //   });

  //   it('should update different properties of the spot', async () => {
  //     const spot = new Spot({
  //       level: 99,
  //       ref: 'Z9',
  //       eco: false,
  //       description: 'Spot to be updated',
  //       personNumber: 1,
  //       type: 'MEETING_ROOM',
  //       isAvailable: true,
  //     });
  //     await spot.save();

  //     const updatedSpotData = {
  //       level: 88,
  //       ref: 'Z10',
  //       eco: true,
  //       description: 'Updated spot description',
  //       personNumber: 5,
  //       type: 'DESK',
  //       isAvailable: false,
  //     };

  //     const response = await chai
  //       .request(app)
  //       .put(`/GSalle/api/spots/${spot._id}`)
  //       .send(updatedSpotData);

  //     expect(response).to.have.status(200);
  //     expect(response.body.message).to.equal('Spot updated  successfully !');
  //     expect(response.body.data.level).to.equal('88');
  //     expect(response.body.data.ref).to.equal('Z10');
  //     expect(response.body.data.eco).to.equal(true);
  //     expect(response.body.data.description).to.equal(
  //       'Updated spot description',
  //     );
  //     expect(response.body.data.personNumber).to.equal(5);
  //     expect(response.body.data.type).to.equal('DESK');
  //     expect(response.body.data.isAvailable).to.equal(false);
  //   });
  // });

  describe('getAvailableSpots', () => {
    it('should return available spots for the specified date and spot type', async () => {
      const spot = new Spot({
        level: 61,
        ref: '2002',
        eco: true,
        description: 'Spot to be updated',
        personNumber: 4,
        type: 'DESK',
        isAvailable: true,
      });
      await spot.save();
      const response = await chai
        .request(app)
        .get('/GSalle/api/spots/availableSpots/2024-12-17/DESK');
      expect(response).to.have.status(200);
      expect(response.body.message).to.equal(
        'Available spots returned successfully!',
      );
      expect(response.body.data.length).to.be.greaterThan(0);
    });

    it('should return an empty array when no spots are available for the specified date and spot type', async () => {
      await Spot.deleteMany({});

      const response = await chai
        .request(app)
        .get('/GSalle/api/spots/availableSpots/2024-12-17/DESK');

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal(
        'Available spots returned successfully!',
      );
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.equal(0);
    });

    // it('should return an error with invalid date or spot type', async () => {
    //   const response = await chai
    //     .request(app)
    //     .get('/GSalle/api/spots/availableSpots/2023-12-13/TEST');

    //   expect(response).to.have.status(400);
    //   expect(response.body.message).to.equal('Unable to retrieve data.');
    // });
  });
});
