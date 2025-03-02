require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Rota principal para indicar que o backend está funcionando
app.get("/", (req, res) => {
    res.send("API do DevBurguer está rodando! 🚀");
});

// Rota que retorna o número do WhatsApp
app.get("/api/whatsapp", (req, res) => {
    res.json({ phone: process.env.WHATSAPP_NUMBER });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));