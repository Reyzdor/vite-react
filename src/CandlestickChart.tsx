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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = { top: 20, right: 60, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    if (!visibleData.length) return;

    const dataToShow = visibleData.slice(-visibleCount);
    const count = dataToShow.length;

    const prices = dataToShow.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;

    const pricePadding = range * 0.05;
    const paddedMin = minPrice - pricePadding;
    const paddedMax = maxPrice + pricePadding;
    const paddedRange = paddedMax - paddedMin;

    const priceToY = (price: number) =>
      padding.top +
      chartHeight -
      ((price - paddedMin) / paddedRange) * chartHeight;

    const candleWidth = 8; 
    const candleGap = 4;  
    const candleStep = candleWidth + candleGap;

    const startX = padding.left + chartWidth - candleStep * (count - 1);

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.fillStyle = "#999";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.lineWidth = 1;

    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = paddedMax - (paddedRange / gridLines) * i;
      ctx.fillText(price.toFixed(2), padding.left - 5, y + 3);
    }

    dataToShow.forEach((candle, index) => {
      const { open, high, low, close } = candle;
      const isGreen = close >= open;
      const color = isGreen ? "#10b981" : "#ef4444";

      const x = startX + index * candleStep;

      const yHigh = priceToY(high);
      const yLow = priceToY(low);
      const yOpen = priceToY(open);
      const yClose = priceToY(close);

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, Math.min(yHigh, yLow));
      ctx.lineTo(x, Math.max(yHigh, yLow));
      ctx.stroke();

      const rawHeight = Math.abs(yOpen - yClose);
      const bodyHeight = Math.max(rawHeight, 1);
      const bodyTop =
        rawHeight < 1 ? (yOpen + yClose) / 2 - bodyHeight / 2 : Math.min(yOpen, yClose);

      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    const lastCandle = dataToShow[count - 1];
    const yCurrent = priceToY(lastCandle.close);

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#fff";
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