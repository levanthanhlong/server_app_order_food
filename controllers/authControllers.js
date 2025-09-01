const session = require("express-session");

const requireLogin = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect("/login");
  }
};

const checkAdmin = (req, res, next) => {
  if (req.session.username == "admin") {
    next();
  } else {
    res.redirect("/home");
  }
};

module.exports = {
  requireLogin,
  checkAdmin,
};
