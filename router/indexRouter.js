const { getHomePage } = require("../controllers/indexController");

const express = require("express");
const router = express.Router();


router.get("/", getHomePage);



module.exports = router;