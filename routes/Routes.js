const express = require("express");
const { Registration, Login, Bonus } = require("../controller");
const router = express.Router();

router.post("/api/user_registration",Registration);
router.post("/api/user_login",Login);
router.get('/api/Bonus/:userId',Bonus)





module.exports = router;