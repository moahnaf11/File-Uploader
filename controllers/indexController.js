const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../cloudinaryConfig");
const {
  addUser,
  addFolder,
  getFolders,
  deleteFolder,
  editFolder,
  getFiles,
  addFileUrl,
  getFile,
  deleteFile,
} = require("../prisma/queries");
const passport = require("passport");
const path = require("path");

// multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB (in bytes)
    files: 1, // Limit to 1 file at a time
  },
});

// sign up form validators
const signUpValidator = [
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name field can't be empty")
    .bail()
    .isAlpha()
    .withMessage("First name field can only take letters"),

  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name field can't be empty")
    .bail()
    .isAlpha()
    .withMessage("Last name field can only take letters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email field can't be empty")
    .bail()
    .isEmail()
    .withMessage("Please input a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password field can't be empty"),

  body("confirm")
    .trim()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),
];

const signInValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email field can't be empty")
    .bail()
    .isEmail()
    .withMessage("Please input a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password field can't be empty"),
];

const createFolderValidation = [
  body("name").trim().notEmpty().withMessage("Name field can't be empty"),
];

const getHomePage = async (req, res) => {
  res.render("home", { user: req.user });
};

const getSignIn = async (req, res) => {
  res.render("signin", { fail: req.flash("error") });
};

const getSignUp = async (req, res) => {
  res.render("signup");
};

const postSignUp = [
  signUpValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("signup", { error: errors.array() });
    } else {
      // add user to database
      const { firstname, lastname, email, password } = req.body;
      const user = await addUser(firstname, lastname, email, password);
      res.redirect("/sign-in");
    }
  }),
];

const postSignIn = [
  signInValidation,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("signin", { error: errors.array() });
    } else {
      // log user in using passport
      return next();
    }
  }),
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  }),
];

const getUserHomePage = async (req, res) => {
  const folders = await getFolders(req.user.id);
  res.render("userHomePage", { user: req.user, folders: folders });
};

const getLogOut = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};

const getCreateFolder = async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("createFolder", { user: req.user });
  } else {
    res.redirect("/");
  }
};

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

const getFolderPage = async (req, res) => {
  const id = req.params.folderId;
  const files = await getFiles(id);
  res.render("userFolderPage", { files: files, user: req.user });
};

const postFile = [
  async (req, res, next) => {
    upload.single("avatar")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          let message = "Max file size allowed is 4MB";
          const id = req.params.folderId;
          const files = await getFiles(id);
          res.render("userFolderPage", {
            files: files,
            user: req.user,
            message: message,
          });
          return;
        }
      } else if (!req.file) {
        let message = "Please select a file";
        const id = req.params.folderId;
        const files = await getFiles(id);
        res.render("userFolderPage", {
          files: files,
          user: req.user,
          message: message,
        });
        return;
      } else if (err) {
        return next(err);
        // An unknown error occurred when uploading.
      } else {
        const id = req.params.folderId;
        console.log("uploaded file", req.file);
        const filename = Date.now() + "--" + req.file.originalname;
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          async (error, result) => {
            if (error) {
              return next(error);
            } else {
              console.log("result", result);
              // save url to database
              const file = await addFileUrl(
                result.secure_url,
                id,
                filename,
                result.created_at,
                result.bytes
              );
              res.redirect("/home/" + id);
            }
          }
        );
        stream.end(req.file.buffer);
      }
    });
  },
];

const getFileDetails = async (req, res) => {
  const fileId = req.params.fileId;
  const file = await getFile(fileId);
  res.render("fileDetails", { user: req.user, file: file });
};

const deleteTheFile = async (req, res) => {
  const fileId = req.params.fileId;
  const file = await deleteFile(fileId);
  const folderId = req.params.folderId;
  res.redirect("/home/" + folderId);
}

module.exports = {
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
  deleteTheFile
};

// <% const date = new Date(file.createdAt).toLocaleDateString("en-GB", {
//   day: "2-digit",
//   month: "2-digit",
//   year: "numeric",
// })
// const time = new Date(file.createdAt).toLocaleTimeString("en-GB", {
//   hour: "2-digit",
//   minute: "2-digit",
//   hour12: false,
// }) %>
