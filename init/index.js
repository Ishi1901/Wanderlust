const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../Models/listing');


URL_MONGO = "mongodb://127.0.0.1:27017/Wanderlust";


main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
});


async function main() {
  await mongoose.connect(URL_MONGO);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"6a9aaf13c58d3e8e30944285"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");

};

initDB();