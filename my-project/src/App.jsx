import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-6">
      <div className="flex space-x-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-20 hover:scale-110 transition" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 hover:scale-110 transition" alt="React logo" />
        </a>
      </div>

      <h1 className="text-3xl font-bold">Vite + React + Tailwind</h1>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          count is {count}
        </button>

        <p className="mt-4 text-gray-300">
          Edit <code className="text-blue-400">src/App.jsx</code> and save to test HMR.
        </p>
      </div>

      <p className="text-gray-400">
        If this is styled, Tailwind is working 🎉
      </p>
    </div>
  )
}

export default App
