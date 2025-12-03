const Listing = require("../model/listning.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    return res.render("./listing/index.ejs", { allListing });
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        }).populate("owner");
    if (!listing) {
        req.flash("error", " Listing you requested for does not exist! ");
        res.redirect("/listings");
        return;
    }
    return res.render("listing/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {

    if (!req.file) {
        req.flash("error", "Image is required");
        return res.redirect("/listings/new");
    }

    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();

    req.flash("success", "New Listing Created🏠");
    return res.redirect("/listings");
};




// module.exports.createListing = async (req, res, next) => {
//     let response = await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1,
//     }).send();
        
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename }
//     newListing.geometry = response.body.features[0].geometry;
//     let result = await newListing.save();
//     console.log(result);
//     req.flash("success", "New Listing Created🏠");
//     return res.redirect("/listings");
// };

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", " Listing you requested for does not exist! ");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    req.flash("success", "Listing Edited successfully!!🏠");
    return res.render("./listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let newlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { url, filename }
        await newlisting.save();
    }
    req.flash("success", "Listing Updated successfully!!🏠");
    return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Delete successfully!!🏠");
    return res.redirect(`/listings`);
};