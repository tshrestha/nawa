import { useEffect, useState } from 'react'

import {
    denver,
    getClosestStation,
    getLatestObservations,
    getPoint,
    type LatestObservations,
    type Point,
    type Station,
    toF
} from './nws.ts'

export default function LatestObservations() {
    const [latestObservations, setLatestObservations] = useState<LatestObservations>()

    useEffect(() => {
        const lat = parseFloat(denver.lat).toFixed(4)
        const lon = parseFloat(denver.lon).toFixed(4)

        getPoint(lat, lon)
            .then((p: Point) => getClosestStation(p.properties.observationStations) as Promise<Station>)
            .then((s: Station) => getLatestObservations(s.properties.stationIdentifier))
            .then((o: LatestObservations) => setLatestObservations(o))
    }, [])

    return (
        latestObservations && (
            <div className={'container mt-3 text-center'}>
                <h1 className={'display-6'}>Denver</h1>
                <h1 className={'display-1'}>{toF(latestObservations?.properties.temperature.value)}º F</h1>
                <span className={'badge fs-6 text-bg-secondary shadow-sm'}>
                    {latestObservations?.properties.textDescription}
                </span>
            </div>
        )
    )
}
