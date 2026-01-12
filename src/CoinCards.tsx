import { useEffect, useRef, useState } from "react"
import MiniSparkline from "./MiniSparkline"

type Props = {
  id: string
  name: string
  price: number
  onClick: () => void
}

const MAX_POINTS = 50

export default function CoinCard({ id, name, price, onClick }: Props) {
  const sparklineKey = `sparkline_${id}`
  const changeKey = `change_${id}`
  const basePriceKey = `basePrice_${id}`

  const [trend, setTrend] = useState<number[]>(() => {
    const saved = localStorage.getItem(sparklineKey)
    if (saved) return JSON.parse(saved)
    return Array(MAX_POINTS).fill(price) 
  })

  const storedBasePrice = localStorage.getItem(basePriceKey)
  const basePrice = useRef(storedBasePrice ? Number(storedBasePrice) : price)

  const storedChange = localStorage.getItem(changeKey)
  const [change, setChange] = useState(storedChange ? Number(storedChange) : 0)

  useEffect(() => {
    if (!storedBasePrice) {
      localStorage.setItem(basePriceKey, price.toString())
    }
  }, [])

  useEffect(() => {
    if (!trend.length) return
    const lastPrice = trend[trend.length - 1]
    if (price !== lastPrice) {
      const diff = price - basePrice.current
      const percent = basePrice.current ? (diff / basePrice.current) * 100 : 0
      setChange(percent)
      localStorage.setItem(changeKey, percent.toString())

      setTrend(prev => {
        const next = [...prev, price].slice(-MAX_POINTS)
        localStorage.setItem(sparklineKey, JSON.stringify(next))
        return next
      })
    }
  }, [price])

  const positive = change >= 0
  const iconSrc = `/icons/${id.toLowerCase()}.svg`

  return (
    <button
    onClick={onClick}
      style={{ height: "170px" }}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all active:scale-[0.98] flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="mr-4">
            <img
              src={iconSrc}
              width={40}
              height={40}
              alt={id}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/icons/default.svg"
              }}
            />
          </div>
          <div className="flex flex-col items-start">
            <div className="text-white font-semibold text-lg">{id.toUpperCase()}</div>
            <div className="text-gray-500 text-sm mt-1">{name}</div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-white font-semibold text-xl mb-1">${price.toFixed(2)}</div>
          <div className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
            {positive ? "+" : ""}
            {change.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-1">
        <MiniSparkline data={trend} positive={positive} height={60} />
      </div>
    </button>
  )
}