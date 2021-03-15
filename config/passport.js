const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/Users')
const crypto = require('../lib/crypto')

const passportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: 'login',
    },
    async function(username, password, done) {
        try {
            console.log(username)
            let user = await Users.findOne({login: username})
            console.log(typeof(user))
            if (!user) return done(null, false, {message: 'There is no users with that email'})
            if (user.password != crypto(password).encrypt()) return done(null, false, {message: 'Incorrect password'})
            return done(null, user); 
        } catch(e) {
            return done(e)
        }
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

module.exports = passportLocal
