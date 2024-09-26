const express = require("express");
const { Registration, Login } = require("../controller");
const router = express.Router();

router.post("/api/user_registration",Registration);
router.post("/api/user_login",Login);






module.exports = router;