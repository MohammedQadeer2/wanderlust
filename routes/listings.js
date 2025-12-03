const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get( 
    //index route
    // validateListing,
    wrapAsync(listingController.index)
)
.post( 
    // create route
    isLoggedIn,
    validateListing, 
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
);

//new route
router.get("/new",
    isLoggedIn, (req, res) => {
    res.render("./listing/new.ejs");
});


router.route("/:id")
.get(
    //show route
    // validateListing, 
    wrapAsync(listingController.showListing)
)
.put(
    // Update Route
    isLoggedIn,
    isOwner, 
    validateListing, 
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
)
.delete(
    //Delete Route
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing)
)

// edit route
router.get("/:id/edit",
    isLoggedIn,isOwner, 
    // validateListing, 
    // upload.single("listing[image]"),
    wrapAsync(listingController.editListing)
);

router;

module.exports = router;
