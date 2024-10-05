const {
  getHomePage,
  getSignIn,
  getSignUp,
  postSignUp,
  postSignIn,
  getUserHomePage,
  getLogOut,
  getCreateFolder,
  postCreateFolder,
  getDeleteFolder,
  getEditFolder,
  postEditFolder,
  getFolderPage,
  postFile,
  getFileDetails,
  deleteTheFile,
  getFileDownload,
} = require("../controllers/indexController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", getHomePage);
router.route("/sign-in").get(getSignIn).post(postSignIn);
router.route("/sign-up").get(getSignUp).post(postSignUp);

router.get("/home", getUserHomePage);

router.get("/log-out", getLogOut);
router.route("/home/create-folder").get(getCreateFolder).post(postCreateFolder);
router.get("/home/delete/:folderId", getDeleteFolder);
router.route("/home/edit/:folderId").get(getEditFolder).post(postEditFolder);
router.route("/home/:folderId").get(getFolderPage).post(postFile);
router.get("/home/:folderId/delete/:fileId", deleteTheFile);
router.get("/home/:folderId/:fileId/download", getFileDownload );
router.get("/home/:folderId/:fileId", getFileDetails);

module.exports = router;
