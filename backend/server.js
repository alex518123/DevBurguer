require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rota principal para carregar o frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Rota que retorna o número do WhatsApp
app.get("/api/whatsapp", (req, res) => {
    const phone = process.env.WHATSAPP_NUMBER;

    if (!phone) {
        console.error("Erro: Número do WhatsApp não foi definido no .env");
        return res.status(500).json({ error: "Número de WhatsApp não configurado" });
    }

    res.json({ phone });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
