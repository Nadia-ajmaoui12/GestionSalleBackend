/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-env node */
const mongoose = require('mongoose');
const { SPOT_TYPES } = require('../utils/constants');

const { Schema } = mongoose;
const reshapingOptions = {
  // include .id (it's a virtual)
  virtuals: true,
  // exclude .__v
  versionKey: false,
  // exclude ._id
  transform(doc, ret) {
    delete ret._id;
    delete ret.deleted;
    delete ret.created;

    return ret;
  },
};

const SpotSchema = new Schema(
  {
    level: {
      type: String,
    },
    ref: {
      type: String,
      lowercase: true,
      validate: {
        async validator(ref) {
          const spot = await this.constructor.findOne({
            ref,
            deleted: false,
          });

          if (spot) {
            if (this._id.equals(spot._id)) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: () => 'The specified ref  is already in use.',
      },
      required: [true, 'Spot ref required'],
    },
    eco: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: SPOT_TYPES,
      required: true,
    },
    personNumber: {
      type: Number,
    },
    isAvailable: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('Spot', SpotSchema);
