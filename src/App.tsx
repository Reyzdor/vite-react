import { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import CoinPage from "./pages/CoinPage"
import CoinCard from "./CoinCards"
import searchIcon from "./media/searchsvg.svg"

type Coin = { id: string; name: string }

function App() {
  const [prices, setPrices] = useState<{ [key: string]: string }>({})
  const [coins, setCoins] = useState<Coin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://main-crypto.onrender.com/price")
        const data = await res.json()
        setPrices(data)
      } catch (err) {
        console.error("Error fetching prices:", err)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("https://main-crypto.onrender.com/coins")
        const data = await res.json()
        setCoins(data)
      } catch (err) {
        console.error("Error fetching coins:", err)
      }
    }

    fetchCoins()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="gradient-bg overflow-x-hidden">
            <div className="max-w-[500px] w-full mx-auto px-4">
              <h1 className="text-white font-medium text-2xl pt-5">Stratum</h1>

              <div className="mt-6 relative">
               <img
                src={searchIcon}
                alt="search"
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  w-5 h-5
                  opacity-70
                  brightness-0 invert
                "
              />

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
                <h1 className="text-gray-400 text-sm font-medium">ОТСЛЕЖИВАЕМЫЕ МОНЕТЫ</h1>
                <button className="text-sm text-blue-500 hover:text-blue-400">+ Добавить</button>
              </div>

              <div className="mt-3 space-y-3 pb-6">
                {coins
                  .filter((coin) =>
                    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((coin) => {
                    const priceRaw = prices[coin.id.toUpperCase()]
                    const price = priceRaw ? Number(priceRaw) : 0
                    if (!price) return null

                    return (
                      <CoinCard
                        key={coin.id}
                        id={coin.id}
                        name={coin.name}
                        price={price}
                        onClick={() => navigate(`/coin/${coin.id}`)}
                      />
                    )
                  })}
              </div>
            </div>
          </div>
        }
      />

      <Route path="/coin/:id" element={<CoinPage coins={coins}/>} />
    </Routes>
  )
}

export default App