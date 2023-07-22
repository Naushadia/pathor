const express = require("express");

const userController = require("../controller/userController");

const isLogIn = require('../middleware/isloggedin')

const router = express.Router();

router.get("/auth", userController.discord);

router.post('/comment',isLogIn,userController.post);

router.get('/comment',isLogIn,userController.get);

router.patch('/comment',isLogIn,userController.patch);

router.delete('/comment',isLogIn,userController.delete);

router.get('/callback', userController.callback)

module.exports = router;