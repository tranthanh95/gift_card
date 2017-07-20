const adminMw = function (req, res, next) {
    if (req.session.user && req.session.user.userClss == 'admin') {
        next();
    } else {
        res.render("login", {
            data: {
                title: "Login"
            }
        });
    }
};

module.exports = adminMw;