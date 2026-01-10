type Props = {
  data: number[]
  positive: boolean
  height?: number
}

export default function MiniSparkline({ data, positive, height = 40 }: Props) {
  if (!data || data.length < 2) return null

  const SVG_WIDTH = 100
  const SVG_HEIGHT = height
  const PADDING_X = 5
  const PADDING_Y = 5

  const min = Math.min(...data)
  const max = Math.max(...data)
  const mid = (max + min) / 2
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = PADDING_X + (index / (data.length - 1)) * (SVG_WIDTH - 2 * PADDING_X)
      const y = SVG_HEIGHT / 2 - ((value - mid) / range) * (SVG_HEIGHT / 2 - PADDING_Y)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="w-full"
      height={SVG_HEIGHT}
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}