/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-env node */
const mongoose = require('mongoose');
const { SALLE_TYPES } = require('../utils/constants');

const { Schema } = mongoose;
const FormatFunc = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
    return ret;
  },
};

const SalleSchema = new Schema(
  {
    level: {
      type: String,
    },
    ref: {
      type: String,
      lowercase: true,
      validate: {
        async validator(ref) {
          const salle = await this.constructor.findOne({
            ref,
            deleted: false,
          });

          if (salle) {
            if (this._id.equals(salle._id)) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: () => 'The specified ref  is already in use.',
      },
      required: [true, 'salle ref required'],
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
      enum: SALLE_TYPES,
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
  { toJSON: FormatFunc },
);

module.exports = mongoose.model('Salle', SalleSchema);
