const express = require("express");
const { getFolderPage, postFile, deleteTheFile, getFileDownload, getFileDetails } = require("../controllers/folderController");


const folderRouter = express.Router({ mergeParams: true });

folderRouter.route("/").get(getFolderPage).post(postFile);
folderRouter.get("/delete/:fileId", deleteTheFile);
folderRouter.get("/:fileId/download", getFileDownload );
folderRouter.get("/:fileId", getFileDetails);

module.exports = folderRouter;
