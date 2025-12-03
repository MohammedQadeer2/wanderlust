const mongoose = require("mongoose");
const Listing = require("../model/listning.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res) => {
    console.log("connecetion Successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    try {
        initData.data = initData.data.map((obj) => ({...obj, owner: '691609cf7ed2721c8a781edf'}));
        await Listing.insertMany(initData.data, { ordered: false });
        console.log("Data inserted successfully");
    } catch (err) {
        console.error("Some documents failed to insert:");
        console.error(err.writeErrors?.map(e => e.err?.errmsg));
    }
};


initDB();




