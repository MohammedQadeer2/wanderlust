const Review = require("../model/reviews.js");
const Listing = require("../model/listning.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    req.flash("success", "Review Created successfully!!✍️");

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    console.log( reviewId);
    await Review.findByIdAndDelete(reviewId);
    let result = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId} } );
    console.log(result);
    req.flash("success", "Review Delete successfully!✍️");
    res.redirect(`/listings/${id}`);
};