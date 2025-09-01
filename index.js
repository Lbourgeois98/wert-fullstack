import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// POST /api/create-session
app.post("/api/create-session", async (req, res) => {
  try {
    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session
", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.WERT_API_KEY, // set in Railway variables
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flow_type: "simple",
        commodity: "BTC",
        network: "bitcoin",
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF", // your Wert partner_id
        click_id: req.body.click_id,             // unique purchase id from frontend
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error creating Wert session:", err);
    res.status(500).json({ error: "Failed to create Wert session" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running");
});
