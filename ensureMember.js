function ensureMember(req, res, next) {
    if (req.isAuthenticated() && req.user.hasRole) {
        return next();
    }
    res.redirect("/pages/login.html")
}

module.exports = { ensureMember }