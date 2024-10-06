const { body, validationResult } = require("express-validator");

const {
  getFolders,
  addFolder,
  deleteFolder,
  editFolder,
} = require("../prisma/queries");

const createFolderValidation = [
  body("name").trim().notEmpty().withMessage("Name field can't be empty"),
];

const getUserHomePage = async (req, res) => {
  const folders = await getFolders(req.user.id);
  res.render("userHomePage", { user: req.user, folders: folders });
};

const getCreateFolder = async (req, res) => {
  res.render("createFolder", { user: req.user });
}
  
const postCreateFolder = [
  createFolderValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("createFolder", { error: errors.array(), user: req.user });
    } else {
      const { name } = req.body;
      const { id } = req.user;
      const folder = await addFolder(id, name);
      res.redirect("/home");
    }
  },
];

const getDeleteFolder = async (req, res) => {
  const folderId = req.params.folderId;
  const deletedFolder = await deleteFolder(folderId);
  res.redirect("/home");
};

const getEditFolder = async (req, res) => {
  res.render("editFolder", { user: req.user, id: req.params.folderId });
};

const postEditFolder = [
  createFolderValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("editFolder", { error: errors.array(), user: req.user });
    } else {
      const { name } = req.body;
      const folderId = req.params.folderId;
      const editedFolder = await editFolder(folderId, name);
      res.redirect("/home");
    }
  },
];

module.exports = {
    getUserHomePage,
    getCreateFolder,
    postCreateFolder,
    getDeleteFolder,
    getEditFolder,
    postEditFolder
}
