import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import Loading from './Loading.tsx'

import Home from './Home.tsx'
import Forecast from './Forecast.tsx'

const Map = lazy(() => import('./Map.tsx'))

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path={'/'} element={<Home />}></Route>
                <Route path={'/map'} element={<Map />} />
                <Route path={'/forecast/:point'} element={<Forecast />} />
            </Routes>
        </Suspense>
    )
}

export default App
