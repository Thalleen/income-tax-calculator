require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const taxRoutes = require("./routes/taxRoutes");

const app = express();

app.use(cors({
    origin: "https://vercel.com/thalleen-c-ns-projects/income-tax-calculator/FanMs49Pi4NA4D6LxhgLXsUw2opP", // Allow all origins (for testing)
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
  }));
app.use(express.json());
app.use("/api/tax", taxRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch((err)=> console.log(err));

app.get("/",(req,res)=>{
    res.send("Income Tax Calculator API is running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});