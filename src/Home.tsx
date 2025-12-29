import LocationSearch from './LocationSearch.tsx'
import { denver } from './nws.ts'
import Forecast from './Forecast.tsx'

export default function Home() {
    return (
        <>
            <LocationSearch />
            <Forecast point={{ lat: denver.lat, lon: denver.lon }} />
        </>
    )
}
