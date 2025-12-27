import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import Home from './Home.tsx'
import Forecast from './Forecast.tsx'
import { ForecastLocationContext } from './ForecastLocationContext.ts'

function App() {
    const [forecastLocation, setForecastLocation] = useState<Record<string, string>>({})

    const forecastContextValue = {
        forecastLocation,
        setForecastLocation
    }

    return (
        <BrowserRouter basename={'/nawa'}>
            <ForecastLocationContext value={forecastContextValue}>
                <Routes>
                    <Route path={'/'} element={<Home />}></Route>
                    <Route path={'/forecast/:point'} element={<Forecast />} />
                </Routes>
            </ForecastLocationContext>
        </BrowserRouter>
    )
}

export default App
