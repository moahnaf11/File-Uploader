const express = require("express");
const { getUserHomePage, getCreateFolder, postCreateFolder, getDeleteFolder, getEditFolder, postEditFolder } = require("../controllers/homeController");
const homeRouter = express.Router({ mergeParams: true });

homeRouter.get("/", getUserHomePage);
homeRouter.route("/home/create-folder").get(getCreateFolder).post(postCreateFolder);
homeRouter.get("/home/delete/:folderId", getDeleteFolder);
homeRouter.route("/home/edit/:folderId").get(getEditFolder).post(postEditFolder);

module.exports = homeRouter;



