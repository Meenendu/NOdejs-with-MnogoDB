const express = require("express");
const router = express.Router();

const { login, signup } = require("../Controller/AuthController");

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
