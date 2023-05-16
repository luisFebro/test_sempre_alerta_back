const express = require("express");
const router = express.Router();
const {
    auth,
    login,
    sessionLogin,
    changeUserPassword,
} = require("../controllers/auth/auth");
const mwCors = require("../controllers/auth/mwCors");

// ROUTE api/auth
router.post("/login", mwCors, login);
router.get("/auth", mwCors, auth);
router.get("/sessionLogin", mwCors, sessionLogin);

// Password
router.post("/pswd/change", mwCors, changeUserPassword);

module.exports = router;
