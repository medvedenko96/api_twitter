const express = require('express'),
    router = express.Router();

const  register = require('../services/register');
const  login = require('../services/login');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
