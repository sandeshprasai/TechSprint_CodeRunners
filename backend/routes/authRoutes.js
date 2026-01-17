const express = require("express");
const loginValidation = require("../middlewares/loginValidation");
const { loginController } = require("../controllers/loginController");

const router = express.Router();

// Login route
router.post("/login", loginValidation, loginController);

module.exports = router;
