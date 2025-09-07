import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';


console.log('Passport config loading...');
console.log('JWT Secret exists:', !!process.env.JWT_SECRET);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const passportConfig= (passport) => {
  console.log('Initializing passport strategies...');
  
  // JWT Strategy
  passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('JWT Strategy executed for payload:', jwt_payload);
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        console.log('User found:', user.email);
        return done(null, user);
      }
      console.log('User not found');
      return done(null, false);
    } catch (err) {
      console.error('JWT Strategy error:', err);
      return done(err, false);
    }
  }));

  // Google OAuth Strategy
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('Google Strategy executed for profile:', profile.id);
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      } else {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        });
        
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err, false);
    }
  }));

  console.log('Passport strategies configured');
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
export default passportConfig;