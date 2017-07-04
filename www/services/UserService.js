const User = require('../models/User.js');

const UserService = {

    listUser: function (callback) {
        User.find(callback);
    },

    findUserByEmail: function (email, callback) {
        User.findOne({
            email
        }, callback);
    },

    register: function (createUser, callback) {
        let user = new User({
            email: createUser.email,
            password: createUser.password,
            fullName: createUser.fullname,
            admin: false,
            salt: createUser.salt,
            create_at: new Date()
        });
        user.save(callback);
    }
}

module.exports = UserService;