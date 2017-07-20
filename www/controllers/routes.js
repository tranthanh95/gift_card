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
// Session user.
var sessionUser;

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
                session: cartManager // Send cart session.
            }
        });
    })

// Router get all users.
router
    .route("/users")
    .get((req, res) => {
        UserService.listUser((err, users) => {
            if (!err && users) {
                console.log(users);
                res.render("user", {
                    data: {
                        users: users, // send list users.
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
        console.log("ID:", id);
        UserService.findUserById(id, (err, user) => {
            if (!err && user) {
                console.log("User", user);
                console.log(sessionUser);
                res.render("userinfor", {
                    data: {
                        title: "UserInfor",
                        user: user,
                        userInfor: sessionUser
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
                // Check password.
                var status = helper.compare_password(userInfor.password, user.password);
                if (status) {
                    req.session.user = user;
                    // delete user session fields.
                    req.session.user.password = null;
                    req.session.user.admin = null;
                    req.session.user.salt = null;
                    req.session.user.block = null;
                    req.session.user.orderAsk = null;
                    req.session.user.orderBid = null;
                    req.session.user.giftCard = null;
                    sessionUser = req.session.user;
                    console.log("Login successfully!!");
                    res.render("index", {
                        data: {
                            title: "Homepage",
                            user: sessionUser // session when user login successfully.
                        }
                    });
                } else {
                    // When user enter Password wrong!
                    res.render("login", {
                        data: {
                            error: "Password wrong!!",
                            title: "Login",
                            userInfor: userInfor
                        }
                    });
                }
            } else {
                // When user enter email or password wrong!
                res.render("login", {
                    data: {
                        error: "Email or password Wrong!!",
                        title: "Login",
                        userInfor: userInfor
                    }
                });
            }
        });
    })

// Router register : COMPLETED.
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
        var userInfor = req.body;
        if (userInfor.email.trim().length == 0) {
            res.render("register", {
                data: {
                    error: "Email is required!",
                    title: "Register",
                    userInfor: userInfor
                }
            });
        }
        if (userInfor.password != userInfor.repassword && userInfor.password.trim().length != 0) {
            res.render("register", {
                data: {
                    error: "Password not match!",
                    title: "Register",
                    userInfor: userInfor
                }
            });
        }
        // Random salt when user create.
        var salt = Math.round(Math.random() * 10 + 5);

        // Hash password from salt random.
        var hash = helper.hash_password(userInfor.password, salt);
        // Information user user create.
        var createUser = {
            email: userInfor.email,
            password: hash,
            fullname: userInfor.fullname,
            salt: salt
        };
        // Call Service create user.
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

// Route show list GiftCard. require('../middlewares/login_middleware'),
router
    .route("/listgift")
    .get((req, res) => {
        // Contain gift card when user choose.
        var giftcard = {};
        console.log("Session when user add to cart!");
        console.log(cartManager);
        var session = cartManager
            ? cartManager
            : {};
        var cart = new Cart(session);
        // Call Service list gift.
        GiftCardService.listGift((err, giftcards) => {
            if (!err && giftcards) {
                // Call Service receive list categories.
                CategoryService.listCategory((err, categories) => {
                    if (!err && categories) {
                        console.log("Session User: ", sessionUser);
                        res.render("index", {
                            data: {
                                categories: categories,
                                giftcards: giftcards,
                                session: cartManager,
                                user: sessionUser,
                                title: "List Gift Card",
                                error: false
                            }
                        });
                    } else {
                        console.log();
                        res.render("index", {
                            data: {
                                giftcards: giftcards,
                                session: cartManager,
                                title: "List Gift Card",
                                error: false
                            }
                        });
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
                // delete cart session fields.
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

// Router Shopping cart. COMPLETED.
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
            // console.log(cart.generateArray());
            res.render("shopping-cart", {
                data: {
                    title: "Shopping Cart",
                    products: cart.generateArray(), // Generate Array from Cart.
                    totalPrice: cart.totalPrice // get totalPrice from Cart.
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
            // Get id product from client request.
            var productId = req.params.id;
            var cart = new Cart(cartManager
                ? cartManager
                : {});
            // Reduce item in cart.
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
    .get((req, res) => {
        if (cartManager) {
            // Get id product from client request.
            var productId = req.params.id;
            var cart = new Cart(cartManager
                ? cartManager
                : {});
            // Remove item in cart.
            cart.removeItem(productId);
            req.session.cart = cart;
            cartManager = req.session.cart;
            res.redirect('/shopping-cart');
        } else {
            res.redirect("/listgift");
        }
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

// Route show list Category.
router
    .route("/cates")
    .get((req, res) => {
        // Service add Category.
        CategoryService.listCategory((err, categories) => {
            if (!err && categories) {
                console.log(categories);
                res.render("list-category", {
                    data: {
                        title: "List Category",
                        session: cartManager,
                        categories: categories
                    }
                })
            } else {
                console.log("Cound not found DB!!");
                console.log(err);
            }
        });
    })

// Route create Category.
router
    .route("/cate/:id")
    .get((req, res) => {
        let cateId = req.params.id;
        // Service add Category.
        CategoryService.listCategory((err, categories) => {
            if (!err && categories) {
                GiftCardService.listGiftByCate(cateId, (err, giftcards) => {
                    if (!err && giftcards) {
                        // console.log(giftcards);
                        res.render("index", {
                            data: {
                                title: "Category",
                                session: cartManager,
                                categories: categories,
                                giftcards: giftcards
                            }
                        })
                    } else {
                        console.log("Error: ");
                        console.log(err);
                        res.render("index", {
                            data: {
                                title: "Category",
                                session: cartManager,
                                categories: categories
                            }
                        })
                    }
                })
            } else {
                res.render("index", {
                    data: {
                        title: "Category",
                        error: "Cound not found Category form DB!!"
                    }
                });
            }
        });
    })

// Router forgot password.
router
    .route("/forgot")
    .get((req, res) => {
        res.render("forgotpassword", {data: false});
    })

// Router buy gift card.
router
    .route("/buy")
    .get((req, res) => {
        var sessUser = new User(sess
            ? sess
            : {});

        if (sess) {
            req.session.sessUser = sessUser;
            sess = req.session.sessUser;
            CategoryService.listCategory((err, categorys) => {
                if (!err && categorys) {
                    res.render("buygift", {
                        data: {
                            categorys: categorys,
                            title: "Buy",
                            session: sess,
                            err: false
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            res.render('login', {
                data: {
                    err: "Do not login",
                    title: "Login"
                }
            });
            console.log("do not login");
        };
    })
    .post((req, res) => {
        var giftId;
        var giftcard = req.body;
        var CreateOrderAsk = {
            user: sess,
            giftcard: giftId,
            priceask: giftcard.priceask
        };

        OrderAskService.addItem(CreateOrderAsk, (err, data) => {
            if (!err && data) {
                giftId = data._id;
                // Information OrderAsk.
                CreateOrderAsk = {
                    user: sess,
                    giftcard: giftId,
                    priceask: giftcard.priceask
                };
                console.log('insert buy giftcard successfully');
                console.log("giftId: ", giftId);
                res.render("index", {
                    data: {
                        title: "Done",
                        err: false
                    }
                });
            } else {
                console.log(err);
            }
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