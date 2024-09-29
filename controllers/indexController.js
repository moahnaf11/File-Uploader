const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { addUser, addFolder, getFolders, deleteFolder, editFolder } = require("../prisma/queries");
const passport = require("passport");
const { name } = require("ejs");

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
  const deletedFolder =  await deleteFolder(folderId);
  res.redirect("/home");
}

const getEditFolder = async(req, res) => {
  res.render("editFolder", {user: req.user, id: req.params.folderId});
}

const postEditFolder = [
  createFolderValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("editFolder", { error: errors.array(), user: req.user });
    } else {
      const {name} = req.body;
      const folderId = req.params.folderId;
      const editedFolder = await editFolder(folderId, name);
      res.redirect("/home");
    }
  }
]


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
  postEditFolder
};

// class="size-6 group-hover:fill-black mx-auto"
