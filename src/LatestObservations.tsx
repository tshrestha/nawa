import { useEffect, useState } from 'react'

import {
    getClosestStation,
    getLatestObservations,
    getPoint,
    type LatestObservations,
    type Point,
    type Station,
    toF
} from './nws.ts'

export interface LatestObservationsProps {
    point: {
        lat: string
        lon: string
    }
    name: string
}

export default function LatestObservations({ point, name }: LatestObservationsProps) {
    const [latestObservations, setLatestObservations] = useState<LatestObservations>()

    useEffect(() => {
        const lat = parseFloat(point.lat).toFixed(4)
        const lon = parseFloat(point.lon).toFixed(4)

        getPoint(lat, lon)
            .then((p: Point) => getClosestStation(p.properties.observationStations) as Promise<Station>)
            .then((s: Station) => getLatestObservations(s.properties.stationIdentifier))
            .then((o: LatestObservations) => setLatestObservations(o))
    }, [point])

    return (
        latestObservations && (
            <div className={'container mt-3 text-center'}>
                <h1 className={'display-6 text-light'}>{name}</h1>
                <h1 className={'display-1 text-light'}>{toF(latestObservations?.properties.temperature.value)}º F</h1>
                <span className={'badge fs-6 text-bg-secondary p-2 fw-light shadow-sm'}>
                    {latestObservations?.properties.textDescription}
                </span>
            </div>
        )
    )
}
