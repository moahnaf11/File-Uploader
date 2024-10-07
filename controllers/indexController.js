const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { addUser, getFile } = require("../prisma/queries");
const passport = require("../utils/passportConfig");

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
    failureRedirect: "/sign-in",
    failureFlash: true,
  }),
];

const getLogOut = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};

const getFileLink = async (req, res) => {
  const id = req.params.fileId;
  const file = await getFile(id);
  const baseUrl = 'http://localhost:3000/share/' + id;
  res.render("fileDetails", {user: req.user, file: file, url: baseUrl});
}

const getShare = async (req, res) => {
  const id = req.params.fileId;
  const file = await getFile(id);
  res.redirect(file.url);
}

module.exports = {
  getHomePage,
  getSignIn,
  getSignUp,
  postSignUp,
  postSignIn,
  getLogOut,
  getFileLink,
  getShare
};
