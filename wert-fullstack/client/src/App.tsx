import { useState } from "react";
import WertWidget from "@wert-io/widget-initializer";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [loading, setLoading] = useState(false);

  const handleBuyClick = async () => {
    setLoading(true);
    try {
      // 1. Ask backend to create Wert session
      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ click_id: uuidv4() }),
      });
      const session = await res.json();

      // 2. Initialize widget with session_id
      const wertWidget = new WertWidget({
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF", // your partner id
        origin: "https://widget.wert.io",
        session_id: session.session_id, // comes from backend
        listeners: {
          loaded: () => console.log("✅ Wert widget loaded"),
          payment_status: (event: any) => console.log("💳 Payment status:", event),
        },
      });

      wertWidget.open();
    } catch (err) {
      console.error("Error loading Wert widget:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Buy Crypto with Wert</h1>
      <button onClick={handleBuyClick} disabled={loading}>
        {loading ? "Loading..." : "Buy with Wert"}
      </button>
    </div>
  );
}

export default App;
