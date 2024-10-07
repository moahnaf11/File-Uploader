const {
  getHomePage,
  getSignIn,
  getSignUp,
  postSignUp,
  postSignIn,
  getLogOut,
  getFileLink,
  getShare,
} = require("../controllers/indexController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", getHomePage);
router.route("/sign-in").get(getSignIn).post(postSignIn);
router.route("/sign-up").get(getSignUp).post(postSignUp);
router.get("/log-out", getLogOut);
router.get("/share/:fileId", getShare);
router.get("/url/:fileId", getFileLink);

module.exports = router;
