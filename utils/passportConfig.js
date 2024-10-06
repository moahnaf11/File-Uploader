const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getUser } = require("../prisma/queries");
const bcrypt = require("bcryptjs");

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
      return done(null, false, { message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
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

module.exports = passport;
