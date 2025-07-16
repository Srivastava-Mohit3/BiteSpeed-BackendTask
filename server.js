import express from "express";
import cors from "cors";

import connectDB from "./db.js";

const app = express();

app.use(express.json());
app.use(cors())

const PORT = 3000;

app.use("/", (req, res) => {
    res.send("Hello Mohit")
})

app.listen(PORT, () => {
    connectDB
      .connect()
      .then(() => {
        console.log("Database Connected!");
        console.log("Name of the database -", connectDB.database);
      })
      .catch((error) => console.log("Error in Database Connection!", error));
    console.log(`App is running on PORT ${PORT}`);
})

