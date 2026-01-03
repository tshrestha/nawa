import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

import Home from './Home.tsx'
const Forecast = lazy(() => import('./Forecast.tsx'))
const Map = lazy(() => import('./Map.tsx'))

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path={'/'} element={<Home />}></Route>
                <Route path={'/map'} element={<Map />} />
                <Route path={'/forecast/:point'} element={<Forecast />} />
            </Routes>
        </Suspense>
    )
}

export default App
