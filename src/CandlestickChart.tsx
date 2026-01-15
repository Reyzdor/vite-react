import { useRef, useLayoutEffect } from "react";

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Props = {
  visibleData: Candle[];
  visibleCount?: number;
  height?: number;
};

export default function CandlestickChart({
  visibleData,
  visibleCount = 30,
  height = 400,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 500;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 20, right: 60, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    if (visibleData.length === 0) return;

    const dataToShow = visibleData.slice(-visibleCount);

    const prices = dataToShow.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const priceToY = (price: number) =>
      padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

    const candleWidth = Math.max(2, chartWidth / visibleCount * 0.7);
    const candleSpacing = chartWidth / visibleCount;
    
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#999";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";

    const gridLinesY = 6;
    for (let i = 0; i <= gridLinesY; i++) {
      const y = padding.top + (chartHeight / gridLinesY) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = maxPrice - (priceRange / gridLinesY) * i;
      ctx.fillText(price.toFixed(2), padding.left - 5, y + 3);
    }

    dataToShow.forEach((candle, index) => {
      const { open, high, low, close } = candle;
      const isGreen = close >= open;
      const color = isGreen ? "#10b981" : "#ef4444";

      const x = padding.left + index * candleSpacing + candleSpacing / 2;
      const yHigh = priceToY(high);
      const yLow = priceToY(low);
      const yOpen = priceToY(open);
      const yClose = priceToY(close);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    const lastCandle = dataToShow[dataToShow.length - 1];
    const yCurrent = priceToY(lastCandle.close);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, yCurrent);
    ctx.lineTo(width - padding.right, yCurrent);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = lastCandle.close >= lastCandle.open ? "#10b981" : "#ef4444";
    ctx.textAlign = "left";
    ctx.fillText(lastCandle.close.toFixed(2), width - padding.right + 5, yCurrent + 3);
  }, [visibleData, visibleCount, height]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px` }} />;
}