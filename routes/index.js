const express = require('express')
const router = express.Router()
const e = require('../e')

/* GET home page. */
router.get('/', e.lib.checkAuth(), function(req, res, next) {
    res.render('index', { title: 'App', user: req.user.login})
})
module.exports = router;
