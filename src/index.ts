import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import router from "./routes";
import * as dotenv from "dotenv";

dotenv.config();
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
