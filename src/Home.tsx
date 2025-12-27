import LocationSearch from './LocationSearch.tsx'
import LatestObservations from './LatestObservations.tsx'
import { denver } from './nws.ts'

export default function Home() {
    return (
        <>
            <LocationSearch />
            <LatestObservations point={{ lat: denver.lat, lon: denver.lon }} name={'Denver'} />
        </>
    )
}
