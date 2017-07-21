const express = require("express");

const router = express.Router();

// Require model
const Cart = require("../models/Cart.js");
const User = require("../models/User.js");

const UserService = require("../services/UserService.js");
const CategoryService= require("../services/CategoryService.js");
const GiftCardService = require("../services/GiftCardService.js");
const OrderBidService = require("../services/OrderBidService.js");
const OrderAskService = require("../services/OrderAskService.js");
// Require helper.
const helper = require("../helpers/helper.js");

// Session cart.
var cartManager;
//Session user
var sess;
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
                    sess = req.session.user;
                    delete req.session.user.password; // Delete password in session.
                    delete req.session.user.salt; // Delete salt in session.

                    var sessUser = new User(sess
                                ? sess
                                : {});
                    console.log("userID",sessUser._id);
                    res.render("index", {
                        data: {
                            title: "Homepage",
                            session: sess
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
                        res.render("index", {
                            data: {
                                categories: categories,
                                giftcards: giftcards,
                                session: cartManager,
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
            console.log("----------------------");
            // console.log(cart.generateArray());
            console.log("----------------------");
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
    .get((req, res, next) => {
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

        // Hash password from salt random.
        var hash = helper.hash_password(user.password, salt);
        var createUser = {
            email: user.email,
            password: hash,
            fullname: user.fullname,
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

// Router buy gift card.
router
    .route("/buy")
    .get((req, res) => {
        //save session user
        var sessUser = new User(sess
                        ? sess
                        : {});
        
        //check login ok not
        if (sess){  

            req.session.sessUser = sessUser;
            sess = req.session.sessUser;
            CategoryService.listCategory((err,categorys) =>{    
                if (!err && categorys){
                    res.render("buygift", {
                        data: {
                            categorys:categorys,
                            title: "Buy",
                            session: sess,
                            err: false
                        }
                    });
                }
                else {
                        console.log(err);
                } 
            });
        }
        else{
            res.render('login',{
                data:{
                    err: "Do not login",
                    title: "Login"
                }
            });
            console.log("do not login");
        };       
    })

    .post((req,res)=> {

     // save infor,ation to orderAsk table   
        var giftId;
        var giftcard=req.body;
        var CreateOrderAsk = {
                            
                user : sess,
                giftcard: giftId,
                priceask: giftcard.priceask
                                                
        };

        OrderAskService.addItem(CreateOrderAsk, (err,data) =>{
                            
            if (!err && data){
                giftId = data._id;
                CreateOrderAsk = {
                            
                    user : sess,
                    giftcard: giftId,
                    priceask: giftcard.priceask
                                                
                    };
                console.log('insert buy giftcard successfully');
                console.log("giftId: " ,giftId);
                res.render("index", {
                            data: {
                            title: "Done",
                            err: false
                            }                              
                });
            }
            else{
                        
                console.log(err);
            }
        });
    })  


// Router sell gift card.       
router
    .route("/sell")
    .get((req, res) => {
        // save session user
        var sessUser = new User(sess
                        ? sess
                        : {});
        // check login or not
        if (sess) {
            req.session.sessUser = sessUser;
            sess = req.session.sessUser;
            console.log(sess._id);

            CategoryService.listCategory((err,category) =>{    
                if (!err && category){
                    res.render("sellgift", {
                            data: {
                                category:category,
                                title: "Sell",
                                session: sess,
                                err: false
                            }
                                                         
                    });
                }
                else{
                    console.log(err);
                }
            });
        }
        else{
            res.render('login',{
                data:{
                    err: "Do not login",
                    title: "Login"
                }
            });
            console.log("do not login");
        };       
    })
    .post((req,res)=> {

        var giftId;                         // get giftid from giftcard table to save in orderbid table
        var giftcard=req.body;


        //check what radio button user select
        // if "No" only save information to giftcard table
        if (giftcard.optradio == 'No'){
                    
            var CreateGiftcard = {
                            
                series: giftcard.series,
                code: giftcard.code,
                image: giftcard.image,
                descriptions: giftcard.descriptions
                                
            };

                GiftCardService.addItem(CreateGiftcard, (err,data) =>{
                            
                    if (!err && data){
                        let giftId = data;
                        console.log('insert only giftcard successfully');
                        console.log("giftId: " ,giftId._id);
                        res.render('index',{
                            data: {
                                giftId: giftId,
                                title: 'My homepage'
                            }

                        });
                    }

                    else{
                        res.status(400).send();
                        console.log(err);
                    }
                });
        };        
        

        // if "Ok" save information to 2 table, giftcard and orderbid
        if (giftcard.optradio == 'Ok'){
            var CreateGiftcard = {
                            
                series: giftcard.series,
                code: giftcard.code,
                image: giftcard.image,
                descriptions: giftcard.descriptions
                                
            };

            GiftCardService.addItem(CreateGiftcard, (err,data) =>{
                            
                if (!err && data){
                    giftId = data._id;
                    console.log('insert giftcard successfully');
                    console.log("giftId: " ,giftId);
                    var orderbid = req.body;

                    var CreateOrderBid = {
                            user : sess,
                            giftcard: giftId,
                            price: orderbid.price,
                            fromPrice_toPrice: orderbid.FromPrice_ToPrice,
                            expiresDate: orderbid.ExpiresDate
                    };

                    OrderBidService.addItem(CreateOrderBid, (err,data) =>{

                            if (!err && data) {
                                console.log("insert in oderbit successfully !");
                                console.log("-----------------");
                                res.render("index", {
                                    data: {
                                        title: "Done",
                                        err: false
                                    }                              
                                });
                            }
                            else{
                                console.log(err);
                            }
                    });

                }
                else{
                    res.status(400).send();
                    console.log(err);
                }
                    console.log("giftId",giftId);
            });

        }    
    }) 
//Router phonecard
router
    .route("/sell/phonecard")
    .get((req, res) => {
        // save session user
        // var sessUser = new User(sess
        //                 ? sess
        //                 : {});
        // // check login or not
        // if (sess) {
            // req.session.sessUser = sessUser;
            // sess = req.session.sessUser;
            // console.log(sess._id);

            CategoryService.listCategory((err,category) =>{    
                if (!err && category){
                    res.render("phonecard", {
                            data: {
                                category:category,
                                title: "Sell",
                                session: sess,
                                err: false
                            }                              
                    });
                }
                else{
                    console.log(err);
                }
            });
        //}
        // else{
        //     res.render('login',{
        //         data:{
        //             err: "Do not login",
        //             title: "Login"
        //         }
        //     });
        //     console.log("do not login");
        // };       
    })
    .post((req,res) =>{
        var category = req.body;
        console.log(category);
        res.render("index", {
            data : {
                category : category,
                title : "success"
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