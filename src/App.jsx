import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import InvitationCard from './InvitationCard'
import BauCuaGame from './BauCuaGame'

function App() {
  const [showGame, setShowGame] = useState(false)

  return (
    <div>
      {showGame ? (
        <div>
          <button
            onClick={() => setShowGame(false)}
            className="fixed top-4 left-4 z-50 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-all shadow-lg"
          >
            ← Quay lại
          </button>
          <BauCuaGame />
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowGame(true)}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg animate-bounce"
          >
            🎲 Chơi Bầu Cua
          </button>
          {/* <InvitationCard /> */}
        </div>
      )}
      <Analytics />
    </div>
  )
}

export default App
