const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../models/users.model');
passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'doc11zaAppsecret'
},
	function (jwtPayload, done) {
		return User.findById(jwtPayload.sub).then(user => {
			return done(null, user);
		}).catch(err => {
			return done(err);
		});
	}
));
