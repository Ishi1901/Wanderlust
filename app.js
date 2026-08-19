const express = require('express');
const app = express();
const mongoose = require('mongoose');

URL_MONGO = "mongodb://127.0.0.1:27017/Wanderlust";
async function main() {
  await mongoose.connect(URL_MONGO);
};


app.get("/",(req,res)=>{
    res.send("Hi im root");
});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})

