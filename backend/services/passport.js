const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: 'REMOVED_SECRET',
  clientSecret: 'REMOVED_SECRET',
  callbackURL: '/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  const existingUser = await User.findOne({ email: profile.emails[0].value });
  if (existingUser) {
    return done(null, existingUser);
  }
  const newUser = new User({
    name: profile.displayName,
    email: profile.emails[0].value,
    role: 'Recipient', // Default role for social login
    password: '', // No password for social login
  });
  await newUser.save();
  done(null, newUser);
}));

