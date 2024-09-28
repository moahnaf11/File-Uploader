const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const indexRouter = require("./router/indexRouter");
const { prisma } = require("./prisma/queries");
const { getUser } = require("./prisma/queries");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// passport config
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verify = async (email, password, done) => {
  try {
    console.log("inside verify");
    const user = await getUser(email);

    if (!user) {
      return done(null, false, {message: "User not found"});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, {message: "Incorrect password"});
    }

    return done(null, user);
  } catch (err) {
    console.log(err);
    return done(err);
  }
};

passport.use(new LocalStrategy(customFields, verify));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await getUser(email);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Session expiry (30 days in milliseconds)
    },
  })
);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());
app.use(flash());
app.use("/", indexRouter);

// global error middleware
app.use((err, req, res, next) => {
  console.log("ERROR DETECTED!", err);
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
