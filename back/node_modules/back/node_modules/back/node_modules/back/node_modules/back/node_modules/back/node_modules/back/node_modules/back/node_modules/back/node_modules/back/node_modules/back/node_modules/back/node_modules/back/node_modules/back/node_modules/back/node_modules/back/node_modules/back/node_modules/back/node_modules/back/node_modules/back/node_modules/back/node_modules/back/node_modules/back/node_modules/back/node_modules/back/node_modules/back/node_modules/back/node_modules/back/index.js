import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import { Router } from "./routes/routes.js";

dotenv.config({ path: "./config/.env" });

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://gig-hub-front.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/gighub", Router);

app.options("*", cors(corsOptions));



app.use((req, res, next) => {
  // console.log("Request Method:", req.method);
  //console.log("Request Headers:", req.headers);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
