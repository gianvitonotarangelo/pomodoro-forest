import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Stati timer (come prima)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  
  // Foresta degli alberi (solo quelli completati!)
  const [forest, setForest] = useState([])
  const [currentTree, setCurrentTree] = useState(null)

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Carica foresta da localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoroForest')
    if (saved) {
      setForest(JSON.parse(saved))
    }
  }, [])

  // Salva foresta
  useEffect(() => {
    localStorage.setItem('pomodoroForest', JSON.stringify(forest))
  }, [forest])

  // Effetto timer
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

  //  PIANTA albero (solo in modalità lavoro)
  function handleStart() {
    if (mode === 'work') {
      const newTree = {
        id: Date.now(),
        startTime: new Date().toISOString(),
        status: 'growing'
      }
      setCurrentTree(newTree)
    }
    setIsRunning(true)
  }

  // ANNULLA albero (non lo salva nella foresta)
  function handlePause() {
    setCurrentTree(null) // Scompare
    setIsRunning(false)
  }

  function handleTimerFinish() {
    setIsRunning(false)
    
    // SALVA ALBERO solo se pomodoro completato
    if (mode === 'work' && currentTree) {
      const grownTree = {
        ...currentTree,
        status: 'grown',
        endTime: new Date().toISOString(),
        duration: durations.work
      }
      setForest(prev => [...prev, grownTree])
      setCurrentTree(null)
    }
    
    // Logica pomodori
    if (mode === 'work') {
      const newCount = completedPomodoros + 1
      setCompletedPomodoros(newCount)
      
      if (newCount >= 4) {
        setMode('longBreak')
        setSecondsLeft(durations.longBreak)
      } else {
        setMode('shortBreak')
        setSecondsLeft(durations.shortBreak)
      }
    } else {
      setMode('work')
      setSecondsLeft(durations.work)
    }
  }

  function handleReset() {
    setCurrentTree(null) // Annulla albero corrente
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
      <h1>Pomodoro Forest </h1>

      {/* Status albero corrente */}
      {currentTree && (
        <div className="current-tree growing">
           Albero in crescita... Completa i 25min per far crescere l'albero!
        </div>
      )}

      <div className="timer">
        <h2>{mode === 'work' ? ' Lavoro' : mode === 'shortBreak' ? ' Pausa' : ' Pausa lunga'}</h2>
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
            </>
          )}
        </div>
      </div>

      <div className="stats">
        <p>Pomodori: {completedPomodoros}/8</p>
        <p>La tua foresta: {forest.length} alberi piantati</p>
      </div>

      {/* Vista foresta - solo alberi completati */}
      <div className="forest">
        
        {forest.length === 0 ? (
          <p>Inizia a concentrarti per far crescere la tua foresta!</p>
        ) : (
          <div className="trees-grid">
            {forest.slice(-8).reverse().map(tree => (
              <div key={tree.id} className="tree grown">
                
                <div>{new Date(tree.startTime).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
