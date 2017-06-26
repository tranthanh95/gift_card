const express = require("express");

const router = express.Router();

// router index.
router.route("/")
    .get((req, res) => {
        res.render("index", { data: false, title: "Home" });
    })

// Router login for user.
router.route("/login")
    .get((req, res) => {
        res.render("login", { data: false });
    })

// Router register
router.route("/register")
    .get((req, res) => {
        res.render("register", { data: false });
    })

// Router buy gift card.
router.route("/buy")
    .get((req, res) => {
        res.render("buygift", { data: false, title: "Buy" });
    })


// Router sell gift card.
router.route("/sell")
    .get((req, res) => {
        res.render("sellgift", { data: false, title: "Sell" });
    })

// Router logout.
router.route("/logout")
    .get((req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/login");
            }
        });
    })

// Export router.
module.exports = router;