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
import { reverseGeocodeSearch } from './lib/geocoding.ts'
import type { Feature } from 'geojson'
import { getTimeOfDay } from './lib/util.ts'
import LatestObservationsPlaceholder from './LatestObservationsPlaceholder.tsx'

export interface LatestObservationsProps {
    point: {
        lat: string
        lon: string
    }
    name?: string
}

export default function LatestObservations({ point }: LatestObservationsProps) {
    const { lat, lon } = point
    const [forecastLocation, setForecastLocation] = useState<Feature>()
    const [latestObservations, setLatestObservations] = useState<LatestObservations>()
    const [pending, isPending] = useState(true)
    const timeOfDay = getTimeOfDay()

    useEffect(() => {
        isPending(true)
        Promise.all([
            reverseGeocodeSearch(lat, lon),
            getPoint(lat, lon)
                .then((p: Point) => getClosestStation(p.properties.observationStations) as Promise<Station>)
                .then((s: Station) => getLatestObservations(s.properties.stationIdentifier))
        ]).then(([r1, r2]: [r1: Feature, r2: LatestObservations]) => {
            setForecastLocation(r1)
            setLatestObservations(r2)
            isPending(false)
        })
    }, [lat, lon])

    return pending ? (
        <LatestObservationsPlaceholder />
    ) : (
        <div className={'mt-4 mb-4 text-center'}>
            <h1 className={'display-6'}>{forecastLocation?.properties?.name}</h1>
            <p className={'mb-0'}>Right meow 🐱 </p>
            <div className={'d-flex justify-content-center align-items-center'}>
                <div className='col text-end'>
                    <img
                        src={getIcon({
                            keyword: latestObservations?.properties.textDescription as string,
                            isDay: timeOfDay !== 'night',
                            isNight: timeOfDay === 'night'
                        })}
                        className={'img-fluid w-50'}
                    />
                </div>
                <div className='col text-start'>
                    <h1 className={'display-1 align-middle'}>
                        {toF(latestObservations?.properties.temperature.value as number)}º
                    </h1>
                </div>
            </div>
            <span className={'badge text-bg-secondary fs-6 p-2 fw-light'}>
                {latestObservations?.properties.textDescription}
            </span>
        </div>
    )
}
