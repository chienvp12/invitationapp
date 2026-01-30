import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const BauCuaGame = () => {
  // Các con vật trong game Bầu Cua
  const symbols = [
    { id: 'bau', name: 'Bầu', emoji: '🎃', color: 'from-orange-400 to-orange-600' },
    { id: 'cua', name: 'Cua', emoji: '🦀', color: 'from-red-400 to-red-600' },
    { id: 'tom', name: 'Tôm', emoji: '🦐', color: 'from-pink-400 to-pink-600' },
    { id: 'ca', name: 'Cá', emoji: '🐟', color: 'from-blue-400 to-blue-600' },
    { id: 'ga', name: 'Gà', emoji: '🐓', color: 'from-yellow-400 to-yellow-600' },
    { id: 'nai', name: 'Nai', emoji: '🦌', color: 'from-amber-400 to-amber-600' }
  ];

  const [bets, setBets] = useState({});
  const [money, setMoney] = useState(1000000);
  const [rolling, setRolling] = useState(false);
  const [diceResults, setDiceResults] = useState([null, null, null]);
  const [showResults, setShowResults] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const diceRefs = [useRef(null), useRef(null), useRef(null)];

  // Thêm tiền cược vào một con vật
  const placeBet = (symbolId, amount) => {
    if (rolling || money < amount) return;
    
    const currentBet = bets[symbolId] || 0;
    const totalBets = Object.values(bets).reduce((sum, bet) => sum + bet, 0);
    
    if (totalBets + amount > money) return;

    setBets({
      ...bets,
      [symbolId]: currentBet + amount
    });
  };

  // Reset tất cả cược
  const resetBets = () => {
    if (rolling) return;
    setBets({});
  };

  // Lắc xúc xắc
  const rollDice = () => {
    const totalBets = Object.values(bets).reduce((sum, bet) => sum + bet, 0);
    if (totalBets === 0 || rolling) return;

    setRolling(true);
    setShowResults(false);
    setAnimationPhase(1);

    // Animation lắc xúc xắc
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceResults([
        symbols[Math.floor(Math.random() * 6)],
        symbols[Math.floor(Math.random() * 6)],
        symbols[Math.floor(Math.random() * 6)]
      ]);
      rollCount++;
      
      if (rollCount > 20) {
        clearInterval(rollInterval);
        
        // Kết quả cuối cùng
        const finalResults = [
          symbols[Math.floor(Math.random() * 6)],
          symbols[Math.floor(Math.random() * 6)],
          symbols[Math.floor(Math.random() * 6)]
        ];
        
        setDiceResults(finalResults);
        setAnimationPhase(2);
        
        setTimeout(() => {
          calculateWinnings(finalResults);
          setShowResults(true);
          setRolling(false);
          setAnimationPhase(0);
        }, 1000);
      }
    }, 100);
  };

  // Tính toán tiền thắng
  const calculateWinnings = (results) => {
    const totalBets = Object.values(bets).reduce((sum, bet) => sum + bet, 0);
    let winnings = 0;

    Object.entries(bets).forEach(([symbolId, betAmount]) => {
      const matchCount = results.filter(r => r.id === symbolId).length;
      winnings += betAmount * matchCount;
    });

    const profit = winnings - totalBets;
    setWinAmount(profit);
    setMoney(money - totalBets + winnings);

    // Lưu lịch sử
    setGameHistory([
      {
        results: results,
        bets: { ...bets },
        profit: profit
      },
      ...gameHistory.slice(0, 4)
    ]);

    // Hiệu ứng pháo hoa nếu thắng lớn
    if (profit > 0) {
      confetti({
        particleCount: Math.min(100, profit / 10),
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setBets({});
  };

  const totalBets = Object.values(bets).reduce((sum, bet) => sum + bet, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 animate-pulse-slow">
            🎲 BẦU CUA 🎲
          </h1>
          <p className="text-white text-sm sm:text-lg md:text-xl opacity-90">Tom Tép</p>
          <div className="mt-3 md:mt-4 inline-block bg-gradient-to-r from-green-400 to-emerald-600 text-white px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-full text-lg sm:text-xl md:text-2xl font-bold shadow-lg transform hover:scale-105 transition-transform">
            💰 {money.toLocaleString()} xu
          </div>
        </div>

        {/* Bàn cược */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          {symbols.map((symbol) => {
            const betAmount = bets[symbol.id] || 0;
            return (
              <div
                key={symbol.id}
                className={`relative bg-gradient-to-br ${symbol.color} rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
                  betAmount > 0 ? 'ring-2 md:ring-4 ring-yellow-400 scale-105' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-1 md:mb-2 animate-bounce-slow">{symbol.emoji}</div>
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-xl mb-2 md:mb-3">{symbol.name}</h3>
                  
                  {/* Hiển thị tiền cược */}
                  {betAmount > 0 && (
                    <div className="bg-yellow-400 text-gray-900 font-bold rounded-md md:rounded-lg px-2 md:px-3 py-1 md:py-2 mb-2 md:mb-3 text-xs sm:text-sm md:text-base animate-slide-in">
                      💰 {betAmount}
                    </div>
                  )}
                  
                  {/* Nút cược */}
                  <div className="flex gap-1 sm:gap-2 justify-center">
                    {[10, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => placeBet(symbol.id, amount)}
                        disabled={rolling || money < amount}
                        className="bg-white/90 hover:bg-white text-gray-900 font-bold px-2 sm:px-3 py-1 rounded-md md:rounded-lg text-xs sm:text-sm transform transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        +{amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Khu vực xúc xắc */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl mb-6 md:mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>
          
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center relative z-10">
            🎲 Kết quả 🎲
          </h2>
          
          <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
            {diceResults.map((result, index) => (
              <div
                key={index}
                ref={diceRefs[index]}
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 ${
                  rolling ? 'animate-spin-3d' : showResults ? 'animate-bounce-in scale-110' : ''
                }`}
              >
                {result && (
                  <span className="text-3xl sm:text-4xl md:text-7xl">{result.emoji}</span>
                )}
              </div>
            ))}
          </div>

          {/* Hiển thị kết quả thắng/thua */}
          {showResults && (
            <div className={`text-center animate-slide-up ${
              winAmount > 0 ? 'text-green-400' : winAmount < 0 ? 'text-red-400' : 'text-yellow-400'
            }`}>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                {winAmount > 0 ? '🎉 THẮNG!' : winAmount < 0 ? '😢 THUA!' : '😐 HÒA!'}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {winAmount > 0 ? '+' : ''}{winAmount.toLocaleString()} xu
              </p>
            </div>
          )}

          {/* Nút điều khiển */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-4 md:mt-6 relative z-10">
            <button
              onClick={resetBets}
              disabled={rolling || totalBets === 0}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              🔄 Đặt lại
            </button>
            <button
              onClick={rollDice}
              disabled={rolling || totalBets === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 sm:px-12 py-2 sm:py-3 rounded-full text-sm sm:text-base transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden"
            >
              {rolling ? (
                <span className="animate-pulse">⏳</span>
              ) : (
                <span>🎲 ({totalBets} xu)</span>
              )}
            </button>
          </div>
        </div>

        {/* Lịch sử */}
        {gameHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
            <h3 className="text-white text-base sm:text-lg md:text-xl font-bold mb-3 md:mb-4">📜 Lịch sử gần đây</h3>
            <div className="space-y-2 md:space-y-3">
              {gameHistory.map((game, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-3 md:p-4 flex items-center justify-between animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-1 sm:gap-2">
                    {game.results.map((result, i) => (
                      <span key={i} className="text-xl sm:text-2xl md:text-3xl">{result.emoji}</span>
                    ))}
                  </div>
                  <div className={`font-bold text-sm sm:text-base md:text-lg ${
                    game.profit > 0 ? 'text-green-400' : game.profit < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {game.profit > 0 ? '+' : ''}{game.profit.toLocaleString()} xu
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-3d {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          100% { transform: rotateY(360deg) rotateX(360deg); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes slide-in {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-spin-3d {
          animation: spin-3d 0.5s linear infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BauCuaGame;
