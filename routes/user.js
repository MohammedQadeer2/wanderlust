const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isLogin,saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup")
.get((req, res) => {
    res.render("./user/signup.ejs");
})
.post(wrapAsync(userController.signUp));



router.route("/login")
.get((req, res) => {
    res.render("./user/login.ejs");
})
.post(
    saveRedirectUrl, 
    passport.authenticate("local", { 
    failureRedirect: "/login", 
    failureFlash: true 
}), 
wrapAsync(userController.logIn)
)

router.get("/logout", 
    userController.logOut
 );

module.exports = router;