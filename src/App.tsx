import { Route, Routes } from 'react-router'

import Home from './Home.tsx'
import Forecast from './Forecast.tsx'

function App() {
    return (
        <Routes>
            <Route path={'/'} element={<Home />}></Route>
            <Route path={'/forecast/:point'} element={<Forecast />} />
        </Routes>
    )
}

export default App
