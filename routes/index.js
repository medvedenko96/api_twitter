const express = require('express'),
    router = express.Router();


const  register = require('../services/register');
const  login = require('../services/login');
const profile = require('../services/profile');

router.post('/register', register);
router.post('/login', login);

router.post('/profile', profile);

module.exports = router;
