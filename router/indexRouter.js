const { getHomePage, getSignIn, getSignUp, postSignUp, postSignIn, getUserHomePage, getLogOut, getCreateFolder, postCreateFolder } = require("../controllers/indexController");

const express = require("express");
const router = express.Router();


router.get("/", getHomePage);
router.route("/sign-in").get(getSignIn).post(postSignIn);
router.route("/sign-up").get(getSignUp).post(postSignUp);

router.get("/home", getUserHomePage);

router.get("/log-out", getLogOut);
router.route("/home/create-folder").get(getCreateFolder).post(postCreateFolder);



module.exports = router;