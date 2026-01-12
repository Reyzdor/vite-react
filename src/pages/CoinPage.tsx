import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Coin = {
  id: string;
  name: string;
};

type Props = {
  coins: Coin[];
};

export default function CoinPage({ coins }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const symbol = id?.toLowerCase() ?? "";
  const coin = coins.find(c => c.id.toLowerCase() === symbol);
  const iconSrc = `/icons/${symbol}.svg`;

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-[500px] w-full mx-auto px-4">
        
        <div className="sticky top-0 z-10 border-b border-gray-800 bg-transparent backdrop-blur">
          <div className="px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={iconSrc}
                alt={symbol}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/icons/default.svg";
                }}
              />

              <div className="flex flex-col">
                <h1 className="text-white font-semibold text-lg">
                  {symbol.toUpperCase()}
                </h1>
                <div className="text-gray-400 text-sm">
                  {coin?.name ?? ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[calc(100vh-72px)]">
        </div>

      </div>
    </div>
  );
}