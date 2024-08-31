import "dotenv/config";
import "express-async-errors";
import express from "express";
import router from "./routes";
import sequelize from "./db/database";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { catchError } from "./middlewares/catchError";
import path from "path";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const app = express();
const PORT = 3001;

app.use(express.json({ limit: "10mb" }));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Banco de dados conectado e modelos sincronizados.");

    app.listen(8080, () => {
      console.log("Servidor rodando na porta 80");
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
};

app.use("/images", express.static(path.join(__dirname, "output")));

app.use(catchError);
startServer();
