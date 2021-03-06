const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const crypto = require('../lib/crypto')
const passport = require('passport');
const e = require('../e')

router.get('/', (req, res) => {
    res.render('index', {title: 'Users'});
});

router.get('/registration', (req, res, next) => {
    res.render('registration', {title: 'Registration'})
})

router.post('/registration', async (req, res) => {
    let login = req.body.login || false
    let password = req.body.password || false
    if(!login || !password) res.render('registration', {title: 'Registration', err: 'Fill in all the fields'})
    const cryptedPassword = crypto(password).encrypt();
    const user = new User({
        login: login,
        password: cryptedPassword
    })
    try { 
        await user.save();
        res.render('registration', {title: 'Registration', good: 'Registration is successfully done'})
    } catch(err) {
        if(err.code == 11000) {
            res.render('registration', {title: 'Registration', err: 'User is already registered'})
        } else {
            res.render('registration', {title: 'Registration' ,err: 'Something went wrong :('})
        }
    }
        
})

router.get('/login', (req, res) => {
    res.render('login', {title: 'login'});
})

router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}))
    // let login = req.body.login || false
    // let password = req.body.password || false
    // if(!login || !password) res.render('login', {err: 'Fill in all the fields'})
    // const [cryptedLogin, cryptedPassword] = [new crypto(login).encrypt(), new crypto(password).encrypt()];
    // const user = await User.findOne({login: cryptedLogin});
    // if(user) {
    //     if (user.password == cryptedPassword) {
    //         req.session.login = login
    //         res.redirect('/')
    //     } else {
    //         res.render('login', {title: 'login', err: 'Password is incorrect'})
    //     }
    // } else {
    //     res.render('login', {title: 'login', err: 'User is not registered'})
    // }
    

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router;
