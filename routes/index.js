var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.login) {
        res.render('index', { title: 'Express', sessionLogin: req.session.login });
    } else {
        res.render('index', { title: 'Express' });
    }
    
});
module.exports = router;
