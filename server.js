const express = require("express");
const path = require("path");
const cors = require("cors");
// const sslRedirect = require("heroku-ssl-redirect");
const helmet = require("helmet");
const compression = require("compression");
const { IS_PROD, IS_DEV } = require("./config");
require("dotenv").config(); // n4

//Init Express
const app = express();

const isProduction = IS_PROD;
console.log("env", isProduction ? "production" : "development");

// MIDDLEWARES
app.use(helmet()); // protect app with secure headers
app.use(helmet.hidePoweredBy());
app.use(compression()); // compress all responses
app.use(express.json()); //n1
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //n2

// ROUTES
app.use("/api/notif", require("./routes/push_notification/pushNotification"));

// others
// keep server awaken every 10 min at https://cron-job.org/en/members/jobs/
app.get("/api/sys/waker", (req, res) => res.json("waking server!"));
app.get("/api/server-date", (req, res) =>
    res.json({
        date: new Date(),
        offset: new Date().getTimezoneOffset(),
    })
);
// Serve static files such as images, CSS files, and JavaScript files for the React frontend <app></app>
isProduction && app.use(express.static(path.join(__dirname, "client/build")));
// END MIDDLEWARES

// INIT SERVER
const server = require("http").Server(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
