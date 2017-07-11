const express = require('express');

const router = express.Router();

const UserService = require("../services/UserService");

// Router index admin.
router
    .route("/")
    .get((req, res) => {
        res.render("admin/index", {
            data: {
                title: "Admin Index"
            }
        });
    })
// Router get all Users.
router
    .route("/users")
    .get((req, res) => {
        UserService.listUser((err, users) => {
            console.log(users);
            res.render("admin/users", {
                data: {
                    title: "User Admin",
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

module.exports = router;