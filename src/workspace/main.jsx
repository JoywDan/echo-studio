import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './app.css'
import { setupSWUpdatePrompt } from './sw-update.js'
setupSWUpdatePrompt()
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
