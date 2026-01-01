import { useEffect, useState } from 'react'

import {
    getClosestStation,
    getLatestObservations,
    getPoint,
    type LatestObservations,
    type Point,
    type Station,
    toF
} from './lib/nws.ts'
import { getIcon } from './lib/wicons.ts'

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
            <div className={'mt-4 mb-4 text-center'}>
                <h1 className={'display-6'}>{name}</h1>
                <div className={'d-flex justify-content-center align-items-center'}>
                    <div className='col text-end'>
                        <img
                            src={getIcon({
                                keyword: latestObservations.properties.textDescription,
                                isDay: true,
                                isNight: false
                            })}
                            className={'img-fluid w-50'}
                        />
                    </div>
                    <div className='col text-start'>
                        <h1 className={'display-1 align-middle'}>
                            {toF(latestObservations.properties.temperature.value)}º F
                        </h1>
                    </div>
                </div>
                <span className={'badge fs-6 text-bg-secondary p-2 fw-light shadow-sm'}>
                    {latestObservations.properties.textDescription}
                </span>
            </div>
        )
    )
}
