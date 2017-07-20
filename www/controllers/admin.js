const express = require('express');

const router = express.Router();

const UserService = require("../services/UserService");
const GiftCardService = require("../services/GiftCardService");

/* Handler req.session.user (admin == 1) */
var sessionAdmin;

// Using middlewares.
router.use(require('../middlewares/admin_middleware'));

//Router index admin.
router
    .route("/")
    .get((req, res) => {
        res.render("admin/index", {
            data: {
                title: "Admin Index"
            }
        });
    })

// Profile admin.
router
    .route("/profile")
    .get((req, res) => {
        res.render("admin/profile", {
            data: {
                title: "Profile"
            }
        });
    })

/**
 *  Router user management.
 *  Methods: show information, update, delete user.
 */
// Router get all Users.
router
    .route("/users")
    .get((req, res) => {
        // Call Service list User.
        UserService.listUser((err, users) => {
            console.log(users);
            res.render("admin/users", {
                data: {
                    title: "Users",
                    users: users
                }
            });
        });
    })

/*  Router update user by ID.
    PARAM: id by user.
*/
router
    .route("/user/edit/:id")
    .get((req, res) => {
        let userId = req.params.id;
        if (userId) {
            // Service find user by id.
            UserService.findUserById(userId, (err, user) => {
                if (!err && user) {
                    res.render("admin/edit-user", {
                        data: {
                            title: "Edit User",
                            user: user
                        }
                    });
                } else {
                    res.redirect("admin/users");
                }
            });
        } else {
            res.redirect("admin/users");
        }
    })
    .post((req, res) => {
        let user = {
            _id: req.body.id,
            email: req.body.email,
            fullName: req.body.fullName,
            admin: req.body.admin
        };
        // Call Service update User.
        UserService.updateUser(user, (err, raw) => {
            if (err) {
                throw handleError(err);
            } else {
                console.log("Update successfully!!!");
                res.redirect("/admin/users");
            }
        })
    })

/*  Router delete user by ID.
    PARAM: id by user.
*/
router
    .route("/user/delete/")
    .post((req, res) => {
        let idUser = req.body.id;
        UserService.deleteUserById(idUser, (err) => {
            if (err) {
                handleError(err);
            } else {
                res.json(400);
            }
        });
    })

/**
 *  Router giftcard management.
 *  Methods: .
 */
// Router get all GiftCards.
router
    .route("/giftcards")
    .get((req, res) => {
        res.render("admin/giftcards", {
            data: {
                title: "GiftCards"
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
    })

// Export router.
module.exports = router;