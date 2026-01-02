import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './app.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { HashRouter } from 'react-router'
import { getTimeOfDay } from './lib/util.ts'

const timeofDay = getTimeOfDay()
document.body.classList.remove('morning')
document.body.classList.remove('day')
document.body.classList.remove('evening')
document.body.classList.remove('night')
document.body.classList.add(timeofDay)

if (timeofDay === 'night') {
    document.body.setAttribute('data-bs-theme', 'dark')
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>
)
