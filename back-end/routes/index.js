var express = require('express');
var router = express.Router();

const APP_NAME = "Timbal";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: APP_NAME });
});

/* Add time log */
router.post('/', function(req, res, next){
    return ;
});

module.exports = router;