const { getHomePage, getSignIn, getSignUp } = require("../controllers/indexController");

const express = require("express");
const router = express.Router();


router.get("/", getHomePage);
router.get("/sign-in", getSignIn)
router.get("/sign-up", getSignUp)



module.exports = router;