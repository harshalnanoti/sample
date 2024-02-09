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


// Serve Static Files for Frontend
if (process.env.NODE_ENV === "production") {
    // Adjust the static files path based on your project structure
    const staticFilesPath = path.join(__dirname, "../frontend/dist");
  
    // Serve static files
    app.use(express.static(staticFilesPath));
  
    // Handle other routes by serving the index.html file
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(staticFilesPath, "index.html"))
    );
  } else {
    app.get("/", (req, res) => res.send("Please set to production"));
  }
  
  



app.use(errorHandler);

app.listen(port, () => console.log(`server started on port ${port}`));
