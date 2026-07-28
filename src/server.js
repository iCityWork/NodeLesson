import express from "express";
import "dotenv/config";
import { connectDB, disconnectDB } from "./config/db.js";


// Import Routes
import movieRoutes from './routes/movieRoutes.js'
import authRoutes from './routes/authRoutes.js'
import watchlistRoutes from './routes/watchlistRoutes.js'

connectDB();

// Create app
const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// API Routes
app.use("/movies", movieRoutes)
app.use("/auth", authRoutes)
app.use("/watchlist", watchlistRoutes)

const PORT = 5001;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})


// Handle Unhandled Promise Rejections ( e.g., databse connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection: ", err);
    Server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle Uncaught Exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception: ", err)
    await disconnectDB();
    process.exit(1);
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
    console.error("SIGTERM recived, shutting down gracefylly");
    Server.close(async () => {
        await disconnectDB();
        process.exit(1);
    })
});