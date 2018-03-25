const express = require('express'),
    router = express.Router();

const  authService = require('../services/authService');
const profile = require('../services/profileService');
const twit = require('../services/twitService');
const following = require('../services/followingService');
const show = require('../services/showService');
const comment = require('../services/commentService');
const like = require('../services/likeService');



//authentication
router.post('/register', authService.register);
router.post('/login', authService.login);

//profile
router.get('/user/:nickname', profile.readOne);
router.get('/user/', profile.readAll);
router.put('/user/:nickname', profile.update);
router.delete('/user/:nickname', profile.delete);

//following and followers
router.get('/subscribe/:nickname', following.subscribe);
router.get('/unsubscribe/:nickname', following.unsubscribe);

//twits
router.post('/twit', twit.create);
router.get('/twit/:id', twit.readOne);
router.get('/twit/', twit.readAll);
router.put('/twit/:id', twit.update);
router.delete('/twit/:id', twit.delete);

// show (main page)
router.get('/show/followers/:nickname', show.followers);
router.get('/show/following/:nickname', show.following);
router.get('/show/my-twits/:nickname', show.myTwits);
router.get('/show/twits/', show.twitsMyFollowing);

//Comment
router.post('/twit/:id/comment', comment.create);
router.get('/twit/comment/:id', comment.readOne);
router.get('/twit/:id/comment/', comment.readAll);


router.put('/comment/:id', comment.update);

router.delete('/comment/:id', comment.delete);

//router.get('twit/:id/comment/', comment.readTwitAndComment);

//like twit
router.get('/like/:id', like.create);
router.delete('/like/:id', like.delete);

//like comment




module.exports = router;
