const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const URL_MONGO = "mongodb://127.0.0.1:27017/Wanderlust";
const session = require("express-session")
const flash = require("connect-flash")
// *Routes*
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")




// ****App configration & middlewares***
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);


main()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(URL_MONGO);
}

// **session**

const sessionOption = {
    secret :"mypassword",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },

};

app.use(session(sessionOption))
app.use(flash())

// Home route

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ***flash middleware**

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")   //sucess created here is an array 
    res.locals.error = req.flash("error")
    next();
})



// *Main routes*

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

// Handle invalid routes

app.all("/{*splat}", (req, res, next) => {
    // console.log("404 URL:", req.originalUrl);
    next(new ExpressError(404, "Page not found!!"));
});

// Error handling middleware

app.use((err, req, res, next) => {
    let {statusCode = 500,message = "Something went wrong" } = err;
    // console.log(err)
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
});



app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});