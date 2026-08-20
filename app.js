const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./Models/listing.js");
const path = require("path");
const engine = require('ejs-mate');
const methodOverride = require("method-override")

app.set("view engin","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);

URL_MONGO = "mongodb://127.0.0.1:27017/Wanderlust";


main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
});


async function main() {
  await mongoose.connect(URL_MONGO);
};


app.get("/",(req,res)=>{
    res.render("home.ejs");
});

// app.get("/testlistings",async(req,res)=>{
//     let sampleListing = new Listing ({
//         title: "Englsih villa",
//         description:"comfortable palace like hotel for family",
//         price: 3000,
//         location:"Goa",
//         country:"India"
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// })


// index route:

app.get("/listings",async(req,res)=>{
    let allListing = await Listing.find({})

    res.render("index.ejs",{allListing})
})
//New route

app.get("/listings/new",(req,res)=>{
    res.render("newlist.ejs")
})

//create in db:

app.post("/listings",async (req,res)=>{
    // let Listing= req.body.Listing
    // new Listing(Listing)
    let newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");

});

//edit route:

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    res.render("edit.ejs", {listing});
});

// update route

app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect("/listings");
});


// Show route

app.get("/listings/:id",async (req,res)=>{
    let {id}  = req.params;
    let info = await Listing.findById(id);
    
    res.render("show.ejs",{info})
}) 

// Delete
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})

