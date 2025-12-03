const { listingSchema, reviewSchema} = require("./schema.js");
const Listing = require("./model/listning.js");
const Review = require("./model/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be Logged in for Such Activities!");
        return res.redirect("/login");
    }
    return next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Author of this Review!!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
};

// server Site validation
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        return next();
    }
};


// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         throw new ExpressError(error.details[0].message, 400);
//     }
    
//     next();
// };


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el)
        throw new ExpressError(400, errMsg);
    } else {
        return next();
    }
};
