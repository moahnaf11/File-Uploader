const express = require("express");
const {
  getUserHomePage,
  getCreateFolder,
  postCreateFolder,
  getDeleteFolder,
  getEditFolder,
  postEditFolder,
} = require("../controllers/homeController");
const homeRouter = express.Router({ mergeParams: true });

homeRouter.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
});

homeRouter.get("/", getUserHomePage);
homeRouter
  .route("/create-folder")
  .get(getCreateFolder)
  .post(postCreateFolder);
homeRouter.get("/delete/:folderId", getDeleteFolder);
homeRouter
  .route("/edit/:folderId")
  .get(getEditFolder)
  .post(postEditFolder);

module.exports = homeRouter;
