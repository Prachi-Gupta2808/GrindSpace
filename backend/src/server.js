import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from 'express';
import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import userRoutes from './routes/user.route.js';
//dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "https://grindspace.vercel.app",
    credentials: true //alow frontend to send cookies
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
});