/* eslint-disable no-magic-numbers */
/* eslint-env node */
const mongoose = require('mongoose');
const { USER_ROLES } = require('../utils/constants');

const { Schema } = mongoose;
const crypto = require('crypto');

const reshapingOptions = {
  // include .id (it's a virtual)
  virtuals: true,
  // exclude .__v
  versionKey: false,
  // exclude ._id
  transform(doc, ret) {
    delete ret._id;
    delete ret.hashedPassword;
    delete ret.salt;
    delete ret.deleted;

    return ret;
  },
};

const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      validate: {
        async validator(email) {
          const user = await this.constructor.findOne({
            email,
            deleted: false,
          });

          if (user) {
            if (this._id.equals(user._id)) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: () => 'The specified email address is already in use.',
      },
      required: [true, 'User email required'],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
    },
    salt: String,
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'CLIENT',
    },
    active: {
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
  { usePushEach: true, toJSON: reshapingOptions },
);

/**
 * Virtuals
 */

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email').validate(
  (email) => email.length,
  'Email cannot be blank',
);

// Validate empty password
UserSchema.path('hashedPassword').validate(
  (hashedPassword) => hashedPassword.length,
  'Password cannot be blank',
);

const validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  this.updated = new Date();
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.hashedPassword)) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword(password) {
    if (!password || !this.salt) return '';
    const salt = new Buffer(this.salt, 'base64');
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('base64');
  },
};

module.exports = mongoose.model('User', UserSchema);
