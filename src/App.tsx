import { useEffect, useState } from "react";

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
    const interval = setInterval(fetchPrice, 100); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>BTC Price</h1>
      <p>{btcPrice}</p>
    </div>
  );
}

export default App;