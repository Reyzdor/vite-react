import { useEffect, useState } from "react";

function App() {
  type Coin = {
    id: string;
    name: string;
  };

  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const backgroundC = "#070707";

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://main-crypto.onrender.com/price");
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("https://main-crypto.onrender.com/coins");
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };
    fetchCoins();
  }, []);

  return (
    <div style={{ backgroundColor: backgroundC, minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
      <div className="max-w-[448px] w-full mx-auto px-4">
        <h1 style={{ color: "#FFFFFF", fontWeight: 500, fontSize: 24, paddingTop: 20 }}>Stratum</h1>

        <div className="mt-6 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 rotate-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
            />
          </svg>

          <input
            type="text"
            placeholder="Поиск монет..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mt-4 h-px bg-gray-800 w-full" />

        <div className="flex items-center justify-between pt-5">
          <h1 style={{ color: "#808080", fontSize: 14, fontWeight: 500 }}>ОТСЛЕЖИВАЕМЫЕ МОНЕТЫ</h1>
          <button className="text-sm text-blue-500 hover:text-blue-400">+ Добавить</button>
        </div>

        <div className="mt-3 space-y-3" style={{ paddingTop: 5 }}>
          {coins
            .filter(coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((coin) => (
              <button
                key={coin.id}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all active:scale-[0.98] flex justify-between items-start"
                style={{ height: "160px", padding: "5px 20px", boxSizing: "border-box" }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 5 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "#FFFFFF" }}>
                    {coin.id.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 14, color: "#888888", marginTop: 2 }}>
                    {coin.name}
                  </span>
                </div>

                <span style={{ fontSize: 16, color: "#FFFFFF", marginTop: 5, marginRight: 5 }}>
                  {prices[coin.id.toUpperCase()] ? `${prices[coin.id.toUpperCase()]} $` : "loading..."}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;