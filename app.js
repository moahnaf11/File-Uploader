const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("./utils/passportConfig");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const indexRouter = require("./router/indexRouter");
const { prisma } = require("./prisma/queries");
const homeRouter = require("./router/homeRouter");
const folderRouter = require("./router/folderRouter");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

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
app.use("/", indexRouter);
app.use("/home", homeRouter ); 
app.use("/home/:folderId", folderRouter);

// global error middleware
app.use((err, req, res, next) => {
  console.log("ERROR DETECTED!", err);
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
