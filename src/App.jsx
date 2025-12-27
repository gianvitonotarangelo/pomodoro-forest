import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Stati del timer
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // 'work', 'shortBreak', 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  // Durate delle modalità (personalizzabili)
  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  }

  // Format tempo MM:SS
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Effetto principale del timer
  useEffect(() => {
    if (!isRunning || secondsLeft === 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleTimerFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, secondsLeft])

  // Cosa succede quando finisce un timer
  function handleTimerFinish() {
    setIsRunning(false)
    
    if (mode === 'work') {
      // Pomodoro completato!
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)
      
      if (newCount >= 4) {
        // Pausa lunga dopo 4 pomodori
        setMode('longBreak')
        setSecondsLeft(durations.longBreak)
      } else {
        // Pausa corta
        setMode('shortBreak')
        setSecondsLeft(durations.shortBreak)
      }
    } else {
      // Pausa finita, torna al lavoro
      setMode('work')
      setSecondsLeft(durations.work)
    }
  }

  // Pulsanti
  function handleStart() {
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setMode('work')
    setSecondsLeft(durations.work)
    setCompletedPomodoros(0)
  }

  function handleSkip() {
    handleTimerFinish()
  }

  return (
    <div className="App">
      <h1>Pomodoro Forest</h1>

      <div className="timer">
        <h2>{mode === 'work' ? ' Lavoro' : mode === 'shortBreak' ? ' Pausa corta' : ' Pausa lunga'}</h2>
        <p className={`time ${mode}`}>{formattedTime}</p>
        
        <div className="controls">
          {isRunning ? (
            <>
              <button onClick={handlePause}> Pausa</button>
              <button onClick={handleReset}> Reset</button>
              <button onClick={handleSkip}> Skip</button>
            </>
          ) : (
            <>
              <button onClick={handleStart}> Start</button>
              <button onClick={handleReset}> Reset</button>
              <button onClick={handleSkip}> Skip</button>
            </>
          )}
        </div>
      </div>

      <div className="stats">
        <p>Pomodori completati: {completedPomodoros}/4</p>
        <p>Prossima: {completedPomodoros >= 4 ? 'Nuovo ciclo!' : 'Pausa corta'}</p>
      </div>
    </div>
  )
}

export default App