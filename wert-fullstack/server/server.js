import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

// --- Serve frontend ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist");

// --- Wert session endpoint ---
app.post("/api/create-session", async (req, res) => {
  try {
    const response = await fetch("https://partner-sandbox.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.WERT_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        flow_type: "simple",
        commodity: req.body.commodity || "BTC",
        network: req.body.network || "bitcoin",
        address: req.body.address,
        click_id: req.body.click_id,
        partner_id: process.env.WERT_PARTNER_ID
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Wert API error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// --- Serve React build ---
app.use(express.static(clientBuildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Fullstack app running on ${PORT}`));
