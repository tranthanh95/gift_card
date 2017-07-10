const express = require("express");

const router = express.Router();

// Require model
const Cart = require("../models/Cart.js");

const UserService = require("../services/UserService.js");
const CategoryService = require("../services/CategoryService.js");
const GiftCardService = require("../services/GiftCardService.js");

// Require helper.
const helper = require("../helpers/helper.js");

// Session cart.
var cartManager;

// GET Homepage.
router
    .route("/")
    .get((req, res) => {
        cartManager = req.session.cart;
        console.log(cartManager);
        var cart = new Cart(cartManager
            ? cartManager
            : {});
        res.render("index", {
            data: {
                title: "My home page",
                session: cartManager
            }
        });
    })

// Router get all users.
router
    .route("/user")
    .get((req, res) => {
        UserService.listUser((err, users) => {
            if (!err && users) {
                console.log(users);
                res.render("user", {
                    data: {
                        users: users,
                        title: "List Users"
                    }
                });
            } else {
                console.log("Error");
            }
        });
    })

router
    .route("/user/:id")
    .get((req, res) => {
        var id = req.params.id;
        UserService.findUserById(id, (err, user) => {
            if (!err && user) {
                res.render("userinfor", {
                    data: {
                        title: "UserInfor"
                    }
                });
            }
        });
    })

// Router login for user. : COMPLETED.
router
    .route("/login")
    .get((req, res) => {
        res.render("login", {
            data: {
                title: "Login"
            }
        });
    })
    .post((req, res) => {
        var userInfor = req.body;
        UserService.findUserByEmail(userInfor.email, (err, user) => {
            if (!err && user) {
                console.log("Successfully");
                var status = helper.compare_password(userInfor.password, user.password);
                if (status) {
                    req.session.user = user;
                    delete req.session.user.password; // Delete password in session.
                    delete req.session.user.salt; // Delete salt in session.
                    console.log(req.session.user);
                    res.render("index", {
                        data: {
                            title: "Homepage"
                        }
                    });
                } else {
                    res.render("login", {
                        data: {
                            error: "Password wrong!!",
                            title: "Login"
                        }
                    });
                }
            } else {
                console.log("error");
                res.render("login", {
                    data: {
                        error: "Username or password Wrong!!",
                        title: "Login"
                    }
                });
            }
        });
    })

// Router add to cart.
router
    .route("/add-to-cart/:id")
    .get((req, res) => {
        var giftId = req.params.id;
        // console.log(giftId);
        var cart = new Cart(cartManager
            ? cartManager
            : {});
        GiftCardService.giftById(giftId, (err, giftcard) => {
            if (!err && giftcard) {
                console.log("Gift Card", giftcard);
                cart.add(giftcard, giftcard._id);
                req.session.cart = cart;
                // delete session fields.
                delete req.session.cart.add;
                delete req.session.cart.reduceByOne;
                delete req.session.cart.removeItem;
                delete req.session.cart.generateArray;
                console.log("Session cart after add items.");
                cartManager = req.session.cart;
                console.log('cartManager: ', cartManager);
                console.log('session: ', req.session);
                res.redirect("/listgift");
            } else {
                console.log("No found data from Database!!");
            }
        });
    })

// Route show list GiftCard. require('../middlewares/login_middleware'),
router
    .route("/listgift")
    .get((req, res) => {
        var giftcard = {};
        console.log("Session when user add to cart!");
        console.log(cartManager);
        var session = cartManager
            ? cartManager
            : {};
        var cart = new Cart(session);
        GiftCardService.listGift((err, giftcards) => {
            if (!err && giftcards) {
                // console.log(giftcards); console.log(giftcards[0].category);
                res.render("index", {
                    data: {
                        giftcards: giftcards,
                        session: cartManager,
                        title: "List Gift Card",
                        error: false
                    }
                });
            } else {
                console.log("Cound not insert DB!!");
                console.log(err);
                res.render("index", {
                    data: {
                        title: "List Gift Card",
                        error: "Cound not insert DB!!"
                    }
                });
            }
        });
    });

// Router Shopping cart.
router
    .route("/shopping-cart/")
    .get((req, res) => {
        if (!cartManager) {
            return res.render('shopping-cart', {
                data: {
                    title: "Shopping Cart",
                    products: null
                }
            });
        } else {
            var cart = new Cart(cartManager);
            console.log("----------------------");
            // console.log(cart.generateArray());
            console.log("----------------------");
            res.render("shopping-cart", {
                data: {
                    title: "Shopping Cart",
                    products: cart.generateArray(),
                    totalPrice: cart.totalPrice
                }
            });
        }
    })

/*  Router reduce gift card by id. COMPLETED.
    Param: id: contain id gift card.
*/
router
    .route('/reduce/:id')
    .get((req, res, next) => {
        if (cartManager) {
            var productId = req.params.id;
            var cart = new Cart(cartManager
                ? cartManager
                : {});
            cart.reduceByOne(productId);
            req.session.cart = cart;
            // Cart manager.
            cartManager = req.session.cart;
            res.redirect('/shopping-cart');
        } else {
            res.redirect("/listgift");
        }

    })

/*  Router remove a gift card by id. COMPLETED.
    Param: id: contain id gift card.
 */
router
    .route('/remove/:id')
    .get((req, res, next) => {
        var productId = req.params.id;
        var cart = new Cart(cartManager
            ? cartManager
            : {});

        cart.removeItem(productId);
        req.session.cart = cart;
        cartManager = req.session.cart;
        res.redirect('/shopping-cart');
    })

/*  Router show information gift-card. COMPLETED.
    Param: id: contain id gift card.
*/
router
    .route("/gift-card/:id")
    .get((req, res) => {
        let id = req.params.id;

        if (id) {
            GiftCardService.listGiftById(id, (err, giftcards) => {
                if (!err && giftcards) {
                    console.log(giftcards);
                } else {
                    console.log("Can't found data from DB!!");
                    console.log(err);
                }
            })
        }
    })

//Route create GiftCard.
router
    .route("/gift-card/new")
    .get((req, res) => {
        var giftcard = {};
        GiftCardService.addItem(giftcard, (err, giftcard) => {
            if (!err && giftcard) {
                console.log(giftcard);
            } else {
                console.log("Cound not insert DB!!");
                console.log(err);
            }
        });
    })

// Route create Category.
router
    .route("/cate/new")
    .get((req, res) => {
        CategoryService.addItem((err, category) => {
            if (!err && category) {
                console.log(category);
            } else {
                console.log("Cound not insert DB!!");
                console.log(err);
            }
        });
    })

// Router forgot password.
router
    .route("/forgot")
    .get((req, res) => {
        res.render("forgotpassword", {data: false});
    })

// Router register : Completed
router
    .route("/register")
    .get((req, res) => {
        res.render("register", {
            data: {
                title: "Register"
            }
        });
    })
    .post((req, res) => {
        var user = req.body;
        if (user.email.trim().length == 0) {
            res.render("register", {
                data: {
                    error: "Email is required!",
                    title: "Register"
                }
            });
        }
        if (user.password != user.repassword && user.password.trim().length != 0) {
            res.render("register", {
                data: {
                    error: "Password not match!",
                    title: "Register"
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
                console.log("Error:", err);
                res.render("register", {
                    data: {
                        error: "Cannot insert DB",
                        title: "Register"
                    }
                });
            } else {
                console.log("Insert successfully!!");
                res.render("login", {
                    data: {
                        title: "Login"
                    }
                });
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

// This will handle 404 requests.
router
    .route("*")
    .get((req, res) => {
        res
            .status(404)
            .send("404");
    });

// Export router.
module.exports = router;
module.exports = router;