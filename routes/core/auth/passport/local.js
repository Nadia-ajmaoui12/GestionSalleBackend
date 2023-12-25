/* eslint-env node */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../../../models/user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ email, deleted: false })
        .then((user) => {
          console.log('Logged use');
          console.log(user);

          if (!user) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          // if(!user.active) {
          //     return done(null, false, {message: "You must activate your account to benefit from our services."});
          // }
          if (!user.authenticate(password)) {
            return done(null, false, {
              message: 'This password is not correct.',
            });
          }

          return done(null, user, { message: 'Logged In Successfully' });
        })
        .catch((err) => done(err));
    },
  ),
);
