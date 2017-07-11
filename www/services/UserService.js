const User = require('../models/User.js');

const UserService = {

    /*  Service find all user if user not block.
       PARAMS: email.
    */
    listUser: function (callback) {
        User.find({
            block: 0
        }, callback)
    },
    /*  Service find user by id.
       PARAMS: id.
    */
    findUserById(id, callback) {
        User.findOne({
            _id: id
        }, callback)
    },
    /*  Service find user by email.
        PARAMS: email.
     */
    findUserByEmail(email, callback) {
        User.findOne({
            email
        }, callback);
    },

    /*  Service update user.
        PARAMS: user(_id, email, fullName, admin).
     */
    updateUser(user, callback) {
        console.log((user.admin == 0)
            ? false
            : true);
        User.update({
            _id: user._id
        }, {
            $set: {
                email: user.email,
                fullName: user.fullName,
                admin: (user.admin == 0)
                    ? false
                    : true
            }
        }, {
            multi: true
        }, callback);
    },
    // Service delete user by id.
    deleteUserById(id, callback) {
        User.update({
            _id: id
        }, {
            $set: {
                block: 1
            }
        }, {
            multi: true
        }, callback);
    },
    // Service insert user.
    register: function (createUser, callback) {
        var user = new User({
            email: createUser.email,
            password: createUser.password,
            fullName: createUser.fullname,
            admin: false,
            salt: createUser.salt,
            block: 0
        });
        user.save(callback);
    }
}

module.exports = UserService;