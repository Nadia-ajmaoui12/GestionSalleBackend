// const passport = require('passport');
// const passportJWT = require("passport-jwt");
// const JWTStrategy   = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;
// var envConfig = require('../../../../config');
// const User = require('../../../../models/user');

// passport.use(new JWTStrategy({
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey: envConfig.SESSION_SECRET
//     },
//     function (jwtPayload, cb) {
//         console.log("jwtPayload");
//         console.log(jwtPayload);
//         //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
//         return User.findById(jwtPayload._id)
//             .then(user => {
//                 return cb(null, user);
//             })
//             .catch(err => {
//                 return cb(err);
//             });
//     }
// ));
