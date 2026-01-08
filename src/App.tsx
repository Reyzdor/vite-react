import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

function App() {
  const [color] = useState({
    dark: "#111111",
    accent: "#222222"
  });

  const [btcPrice, setBtcPrice] = useState<string>("...");
  const [colorText] = useState("#FFFFFF");

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("https://ba2d64ef6772.ngrok-free.app/price");
        const data = await res.json();
        console.log("Fetched BTC price:", data.btcPrice); 
        setBtcPrice(data.btcPrice);
      } catch (err) {
        console.error("Error fetching BTC price:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: `linear-gradient(120deg, ${color.dark}, ${color.accent})`, height: '100vh', padding: '20px' }}>
      <h2 style={{ color: colorText, textAlign: "center" }}>{btcPrice}</h2>
      <Snowfall />
    </div>
  );
}

export default App;