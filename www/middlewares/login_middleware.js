function logger(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.render("login", {
            data: {
                title: "Login"
            }
        })
    }
}

module.exports = logger;