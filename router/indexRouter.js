const { getHomePage, getSignIn, getSignUp, postSignUp, postSignIn, getUserHomePage } = require("../controllers/indexController");

const express = require("express");
const router = express.Router();


router.get("/", getHomePage);
router.route("/sign-in").get(getSignIn).post(postSignIn);
router.route("/sign-up").get(getSignUp).post(postSignUp);

router.get("/home", getUserHomePage);



module.exports = router;