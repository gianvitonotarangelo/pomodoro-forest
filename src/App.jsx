import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 25 minuti in secondi
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  // Format del tempo tipo MM:SS
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`

  // Effetto che fa andare il timer quando è in running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // arrivato a 0, fermo il timer
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // pulizia dell'intervallo quando il componente si smonta
    // o quando isRunning cambia
    return () => clearInterval(interval)
  }, [isRunning])

  function handleStart() {
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setSecondsLeft(25 * 60)
  }

  return (
    <div className="App">
      <h1>Pomodoro Forest</h1>

      <div className="timer">
        <h2>Timer</h2>
        <p>{formattedTime}</p>
        <div className="controls">
          <button onClick={handleStart}>Start</button>
          <button onClick={handlePause}>Pausa</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="session-info">
        <p>Modalità: lavoro</p>
        <p>Pomodori completati oggi: 0</p>
      </div>
    </div>
  )
}

export default App