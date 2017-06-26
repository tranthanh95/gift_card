function logger(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.render("login", { data: false });
    }
}

module.exports = {
    logger: logger
}