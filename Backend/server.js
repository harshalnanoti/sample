const express = require("express");
const path = require  ("path")
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/DB");
const port = process.env.PORT || 5000;
const cors = require("cors");

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Use CORS middleware
app.use(cors());


app.use("/api/tasks", require("./routes/tasksRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


// server frontend
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/build")))
    app.get("*", (req,res)=> res.sendFile(path.resolve(__dirname,"../","frontend","build","index.html")))
}else{
    app.get('/',(req,res)=>res.send("please set to a production"))
}



app.use(errorHandler);

app.listen(port, () => console.log(`server started on port ${port}`));
