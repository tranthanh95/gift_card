const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();

// Set engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "www", "views"));

// Using middeware.
app.use(express.static(path.join(__dirname, "www", "public")));
app.use(session({
    secret: "this is a scret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie 30 days.
    }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routing Admin.
app.use("/admin/", require("./www/controllers/admin.js"));
// Routing.
app.use(require("./www/controllers/routes.js"));

// Config.
const CONFIG = require("./config");

// Connect mongoDB.
mongoose.connect("mongodb://localhost:27017/gift_card", () => {
    app.listen(CONFIG.port, (err) => {
        if (err) {
            console.log("Cannot listen on port " + CONFIG.port);
        } else {
            console.log("Server listenning on port " + CONFIG.port);
        }
    });
}, (err) => {
    process.exit(1);
});