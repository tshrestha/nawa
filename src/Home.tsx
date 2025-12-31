import { denver } from './nws.ts'
import Forecast from './Forecast.tsx'
import LocationSearchForm from './LocationSearchForm.tsx'

export default function Home() {
    return (
        <>
            <LocationSearchForm />
            <Forecast point={{ lat: denver.lat, lon: denver.lon }} />
        </>
    )
}
