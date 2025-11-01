import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import httpStatus from "http-status";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { connectToSocket } from "./controllers/socketManager.js"
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));
app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
    return res.json({"hello": "world"})
});
const dbUrl = process.env.ATLASDB_URL;
const start = async ()=>{
    const connectionDB = await mongoose.connect(dbUrl)
    console.log(`mongo connected to host ${connectionDB.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("Listening on port 8000");
    });
}
start();