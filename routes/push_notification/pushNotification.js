const express = require("express");
const router = express.Router();
const {
    sendPushNotification,
} = require("../../controllers/push_notification/pushNotification");
// const mwCors = require("../../controllers/auth/mwCors");

// ROUTE api/notif
router.get("/send", sendPushNotification);

module.exports = router;
