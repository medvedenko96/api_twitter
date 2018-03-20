const express = require('express'),
    router = express.Router();

const  authService = require('../services/authService');

const profile = require('../services/profileService');
const  addTwitService = require('../services/addTwitService');
const following = require('../services/followingService');
const showService = require('../services/showService');


//authentication
router.post('/register', authService.register);
router.post('/login', authService.login);

router.get('/user/:nickname', profile);
router.post('/add-twit', addTwitService);

router.get('/subscribe/:nickname', following.subscribe);
router.get('/unsubscribe/:nickname', following.unsubscribe);

router.get('/show/followers/:nickname', showService.followers);
router.get('/show/following/:nickname', showService.following);
router.get('/show/my-twits/:nickname', showService.myTwits);
router.get('/show/twits/', showService.twitsMyFollowing);




module.exports = router;
