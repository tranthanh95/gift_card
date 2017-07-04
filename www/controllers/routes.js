const express = require("express");

const router = express.Router();

const UserService = require('../services/UserService.js');

const helper = require("../helpers/helper");

// router index.
router
    .route("/")
    .get((req, res) => {
        res.render("index", {
            data: false,
            title: "Home"
        });
    })

router
    .route("/user")
    .get((req, res) => {
        UserService.listUser((users) => {
            console.log(users);
            res.render("user", {data: users});
        });

    })

// Router login for user.
router
    .route("/login")
    .get((req, res) => {
        res.render("login", {data: false});
    })
    .post((req, res) => {
        let userInfor = req.body;

        UserService.findUserByEmail(userInfor.email, (err, user) => {
            if (!err && user) {
                var status = helper.compare_password(userInfor.password, user.password);
                if (status) {
                    req.session.user = user;
                    delete req.session.user.password; // Delete password in session.
                    delete req.session.user.salt; // Delete salt in session.
                    console.log(req.session.user);
                    res.render("index", {data: false});
                } else {}
            }
        });
    })

// Router forgot password.
router
    .route("/forgot")
    .get((req, res) => {
        res.render("forgotpassword", {data: false});
    })

// Router register
router
    .route("/register")
    .get((req, res) => {
        res.render("register", {data: false});
    })
    .post((req, res) => {
        var user = req.body;
        if (user.email.trim().length == 0) {
            res.render("register", {
                data: {
                    error: "Email is required!"
                }
            });
        }
        if (user.password != user.repassword && user.password.trim().length != 0) {
            res.render("register", {
                data: {
                    error: "Password not match!"
                }
            });
        }
        // Random salt when user create.
        var salt = Math.round(Math.random() * 10 + 5);

        var hash = helper.hash_password(user.password, salt);
        var createUser = {
            email: user.email,
            password: hash,
            fullname: user.fullname,
            salt: salt
        };

        UserService.register(createUser, (err, user) => {
            if (err) {
                res.render("register", {
                    data: {
                        error: "Cannot insert DB"
                    }
                });
            } else {
                console.log("Insert successfully!!");
                res.render("login", {data: false});
            }
        });

    })

// Router buy gift card.
router
    .route("/buy")
    .get((req, res) => {
        res.render("buygift", {
            data: false,
            title: "Buy"
        });
    })

// Router buy gift information.
router
    .route("/gift-card")
    .get((req, res) => {
        res.render("gift-card", {
            data: false,
            title: "Buy"
        });
    })

// Router sell gift card.
router
    .route("/sell")
    .get((req, res) => {
        res.render("sellgift", {
            data: false,
            title: "Sell"
        });
    })

// Router logout.
router
    .route("/logout")
    .get((req, res) => {
        req
            .session
            .destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/login");
                }
            });
    })

// Export router.
module.exports = router;