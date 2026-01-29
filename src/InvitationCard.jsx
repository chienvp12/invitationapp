import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const InvitationCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: 0, left: 0 });
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(300);
  const [showConfirmContent, setShowConfirmContent] = useState(false);
  const [buttonWidth, setButtonWidth] = useState('auto');
  const cardRef = useRef(null);
  const noButtonRef = useRef(null);

  // Entry animation khi component mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Hàm tính vị trí random cho nút "Không"
  const getRandomPosition = () => {
    if (!noButtonRef.current) return { top: 0, left: 0 };

    const padding = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Kích thước button cố định
    const btnWidth = 140;
    const btnHeight = 56;
    
    // Khung an toàn - safe area để button luôn nhìn thấy được
    // Giữ button trong vùng từ (20px, 20px) đến (viewport - 20px - btnWidth/Height)
    const minTop = padding;
    const maxTop = Math.max(padding, viewportHeight - btnHeight - padding);
    const minLeft = padding;
    const maxLeft = Math.max(padding, viewportWidth - btnWidth - padding);
    
    // Random vị trí trong phạm vi an toàn
    const randomTop = minTop + Math.random() * Math.max(0, maxTop - minTop);
    const randomLeft = minLeft + Math.random() * Math.max(0, maxLeft - minLeft);
    
    // Đảm bảo luôn nằm trong khung an toàn
    const finalTop = Math.max(minTop, Math.min(randomTop, maxTop));
    const finalLeft = Math.max(minLeft, Math.min(randomLeft, maxLeft));
    
    return {
      top: Math.round(finalTop),
      left: Math.round(finalLeft)
    };
  };

  // Xử lý click nút "Không"
  const handleNoClick = () => {
    const newPosition = getRandomPosition();
    setNoButtonPosition(newPosition);
    
    // Tăng click count
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Tăng scale nút "Xác nhận"
    setYesButtonScale(1 + newClickCount * 0.1);
    
    // Tăng tốc độ animation
    setTransitionDuration(Math.max(150, 300 - newClickCount * 30));
  };

  // Xử lý click nút "Xác nhận"
  const handleYesClick = () => {
    // Trigger confetti
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.2 },
        colors: ['#ff6b9d', '#c44569', '#ffa502', '#ff6348', '#a29bfe']
      });
    }, 30);
    
    // Fade out card và hiển thị nội dung cảm ơn
    setConfirmed(true);
    setTimeout(() => {
      setShowConfirmContent(true);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        ref={cardRef}
        className={`relative w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-700 ${
          showConfirmContent
            ? 'opacity-100 translate-y-0 scale-100'
            : isVisible && !confirmed
            ? 'opacity-100 translate-y-0 scale-100'
            : !confirmed
            ? 'opacity-0 translate-y-8 scale-95'
            : 'opacity-0 scale-90'
        }`}
      >
        {!showConfirmContent ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block mb-4">
                <div className="text-5xl mb-2">🥩🍗🍗🥩🥩🥩🥩</div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Đi ăn
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-8 text-center">
              <div>
                <p className="text-gray-600 text-sm mb-1">Bạn à</p>
                <p className="text-xl font-semibold text-gray-800">Bạn ơi</p>
              </div>


              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📅</span>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-semibold text-gray-800">Chưa chốt - Thứ 7, 31/01/2026</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Địa điểm</p>
                    <p className="font-semibold text-gray-800">Quán nướng nào đó</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 italic text-sm">
                Sự có mặt của bạn sẽ có thêm bát thêm đũa! ✨
              </p>
            </div>

            {/* Buttons Container */}
            <div className="relative min-h-[120px]">
              {/* Nút Xác nhận - luôn ở vị trí cố định */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleYesClick}
                  style={{
                    transform: `scale(${yesButtonScale})`,
                  }}
                  className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 w-full md:w-auto group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Xác nhận tham dự</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </div>

              {/* Nút Không - di chuyển random */}
              <div className="flex justify-center relative min-h-[56px]">
                {clickCount > 0 && (
                  <div className="w-full h-14"></div>
                )}
                <button
                  ref={noButtonRef}
                  onClick={handleNoClick}
                  style={{
                    position: clickCount > 0 ? 'fixed' : 'static',
                    top: clickCount > 0 ? `${noButtonPosition.top}px` : 'auto',
                    left: clickCount > 0 ? `${noButtonPosition.left}px` : 'auto',
                    width: clickCount > 0 ? '140px' : 'auto',
                    transition: `all ${transitionDuration}ms ease-out`,
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  className="bg-red-400 text-white font-semibold px-8 py-4 rounded-full shadow hover:bg-red-500 transition-colors duration-200 w-full md:w-auto whitespace-nowrap"
                >
                  ✗
                </button>
              </div>
            </div>

            {/* Thông báo sau 3 lần click */}
            {clickCount >= 3 && (
              <div className="text-center mt-6 animate-bounce">
                <p className="text-pink-600 font-semibold text-lg">
                  Đừng trốn nữa 😆
                </p>
              </div>
            )}
          </>
        ) : (
          /* Nội dung sau khi xác nhận */
          <div className="text-center py-8 animate-[pop-in_0.5s_ease-out]">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
              🍜🍜🍜🍜🍜🍛🍚🍚🍛🍜🍛🍚🥣
            </h2>
            <p className="text-gray-700 text-lg mb-2">
              Hẹn gặp bạn
            </p>
            <div className="flex justify-center gap-2 text-3xl mt-6">
              <span className="animate-[wiggle_1s_ease-in-out_infinite]">🎊</span>
              <span className="animate-[wiggle_1s_ease-in-out_0.2s_infinite]">✨</span>
              <span className="animate-[wiggle_1s_ease-in-out_0.4s_infinite]">🎈</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

export default InvitationCard;
