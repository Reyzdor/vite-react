import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

function App() {
  const [btcPrice, setBtcPrice] = useState("loading...");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("https://main-crypto.onrender.com/price");
        const data = await res.json();
        setBtcPrice(data.btcPrice);
      } catch (err) {
        console.error("Error fetching BTC price:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        background: "linear-gradient(120deg, #111111, #222222)",
        height: "100vh",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Snowfall />
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>BTC Price</h1>
      <p
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          background: "linear-gradient(90deg, #FFD700, #FF8C00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 10px rgba(255,215,0,0.5)"
        }}
      >
        ${btcPrice}
      </p>
    </div>
  );
}

export default App;