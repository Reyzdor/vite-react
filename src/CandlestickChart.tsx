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
  const smoothStartXRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const draw = () => {
      const width = parent.clientWidth;
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

      const targetStartX =
        padding.left + chartWidth - candleStep * (count - 1);

      if (smoothStartXRef.current === null) {
        smoothStartXRef.current = targetStartX;
      }

      smoothStartXRef.current +=
        (targetStartX - smoothStartXRef.current) * 0.3;

      const startX = smoothStartXRef.current;

      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.fillStyle = "#999";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.lineWidth = 1;

      for (let i = 0; i <= 6; i++) {
        const y = padding.top + (chartHeight / 6) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        const price = paddedMax - (paddedRange / 6) * i;
        ctx.fillText(price.toFixed(2), padding.left - 5, y + 3);
      }

      dataToShow.forEach((candle, index) => {
        const color = candle.close >= candle.open ? "#10b981" : "#ef4444";
        const x = startX + index * candleStep;

        const yHigh = priceToY(candle.high);
        const yLow = priceToY(candle.low);
        const yOpen = priceToY(candle.open);
        const yClose = priceToY(candle.close);

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
        ctx.fillStyle = color;
        ctx.fillRect(
          x - candleWidth / 2,
          Math.min(yOpen, yClose),
          candleWidth,
          bodyHeight
        );
      });

      const lastCandle = dataToShow[count - 1];
      const yCurrent = priceToY(lastCandle.close);

      const priceLineX = width - padding.right - candleWidth / 2;
      const rawStartX = startX + (count - 1) * candleStep;
      const limitedStartX = Math.min(rawStartX, priceLineX);

      const limitedYCurrent = Math.max(
        Math.min(yCurrent, padding.top + chartHeight),
        padding.top
      );

      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = lastCandle.close >= lastCandle.open ? "#10b981" : "#ef4444";
      ctx.lineWidth = 0.8;

      ctx.beginPath();
      ctx.moveTo(limitedStartX, limitedYCurrent);
      ctx.lineTo(priceLineX, limitedYCurrent);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = lastCandle.close >= lastCandle.open ? "#10b981" : "#ef4444";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";

      ctx.fillText(
        lastCandle.close.toFixed(2),
        priceLineX - 2,
        limitedYCurrent + 3
      );
    };

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(parent);

    return () => resizeObserver.disconnect();
  }, [visibleData, visibleCount, height]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px` }} />;
}