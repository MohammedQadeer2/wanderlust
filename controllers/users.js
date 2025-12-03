const User = require("../model/user.js");

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust!");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.logIn = async (req, res) => {
    req.flash("success", "welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl;
    if(!redirectUrl) {
        return res.redirect("/listings");
    }
    res.redirect(res.locals.redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logout((err)=> {
        if(err) {
            return next(err);
        }
        req.flash("success", "You're Logged Out Successfully!");
        res.redirect("/listings");
    });
};
