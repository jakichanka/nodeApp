const express = require('express')
const router = express.Router()
const e = require('../e')

/* GET home page. */
router.get('/', e.lib.checkAuth(), function(req, res, next) {
    if (req.user) {
        res.render('index', { title: 'Express', user: req.user.login });
    } else {
        res.render('index', { title: 'Express' });
    }
    
});
module.exports = router;
