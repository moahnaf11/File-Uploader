const { getHomePage, getSignIn, getSignUp, postSignUp, postSignIn, getUserHomePage, getLogOut, getCreateFolder, postCreateFolder, getDeleteFolder, getEditFolder, postEditFolder } = require("../controllers/indexController");

const express = require("express");
const router = express.Router();


router.get("/", getHomePage);
router.route("/sign-in").get(getSignIn).post(postSignIn);
router.route("/sign-up").get(getSignUp).post(postSignUp);

router.get("/home", getUserHomePage);

router.get("/log-out", getLogOut);
router.route("/home/create-folder").get(getCreateFolder).post(postCreateFolder);
router.get("/home/delete/:folderId", getDeleteFolder);
router.route("/home/edit/:folderId").get(getEditFolder).post(postEditFolder)



module.exports = router;