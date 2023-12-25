'use strict';
/* eslint-env node */
const mongoose = require('mongoose');
const { RESERVATION_STATES, TIME_SLOT_VALUES } = require('../utils/constants');
const Schema = mongoose.Schema;

const reshapingOptions = {
  // inclure .id (c'est un virtuel)
  virtuals: true,
  // exclure .__v
  versionKey: false,
  // exclure ._id
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.deleted;
    delete ret.created;

    return ret;
  },
};

const ReservationSchema = new Schema(
  {
    spotId: {
      type: Schema.Types.ObjectId,
      ref: 'Spot',
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeSlot: {
      type: String,
      enum: TIME_SLOT_VALUES,
      required: true,
    },
    status: {
      type: String,
      enum: RESERVATION_STATES,
      default: 'PENDING',
    },
    reservationDate: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: reshapingOptions },
);

module.exports = mongoose.model('Reservation', ReservationSchema);
