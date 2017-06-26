const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Set engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "www", "views"));

// Using middeware.
app.use(express.static(path.join(__dirname, "www", "public")));
app.use(session({
    secret: "this is a scret",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Routing.

app.use(require("./www/controllers/routes.js"));

const CONFIG = require("./config");

mongoose.connect("mongodb://localhost/gift_card",
    () => {
        app.listen(CONFIG.port, (err) => {
            if (err) {
                console.log("Cannot listen on port " + CONFIG.port);
            } else {
                console.log("Server listenning on port " + CONFIG.port);
            }
        });
    },
    (err) => {
        process.exit(1);
    }
);