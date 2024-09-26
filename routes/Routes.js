const express = require("express");
const { Registration, Login, Profile } = require("../controller");
const router = express.Router();

router.post("/api/user_registration",Registration);
router.post("/api/user_login",Login);
router.get("/api/user_profile",Profile);






module.exports = router;