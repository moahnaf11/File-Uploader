const { getHomePage, getSignIn, getSignUp, postSignUp, postSignIn } = require("../controllers/indexController");

const express = require("express");
const router = express.Router();


router.get("/", getHomePage);
router.route("/sign-in").get(getSignIn).post(postSignIn);
router.route("/sign-up").get(getSignUp).post(postSignUp);



module.exports = router;