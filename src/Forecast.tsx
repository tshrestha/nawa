import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { type ForecastResult, type Point, getForecast, getPoint } from './lib/nws.ts'
import LatestObservations from './LatestObservations.tsx'
import ShortForecast from './ShortForecast.tsx'
import DetailedForecast from './DetailedForecaset.tsx'
import { getLatLon } from './lib/util.ts'

export interface ForecastProps {
    point?: {
        lat: string
        lon: string
    }
}

export default function Forecast({ point }: ForecastProps) {
    const location = useLocation()
    let lat, lon

    if (point) {
        lat = point.lat
        lon = point.lon
    } else {
        const latlon = getLatLon(location.pathname)
        lat = latlon.lat
        lon = latlon.lon
    }

    const [forecastResult, setForecastResult] = useState<ForecastResult>()
    const [pending, setPending] = useState(true)

    useEffect(() => {
        setPending(true)
        getPoint(lat, lon)
            .then((p: Point): Promise<ForecastResult> => getForecast(p.properties.forecast) as Promise<ForecastResult>)
            .then((f: ForecastResult) => {
                setForecastResult(f)
                setPending(false)
            })
    }, [lat, lon])

    return (
        <>
            <LatestObservations point={{ lat, lon }} />
            {pending ? (
                <></>
            ) : (
                <>
                    <ShortForecast forecastResult={forecastResult!} />
                    <DetailedForecast forecastResult={forecastResult} />
                </>
            )}
            {location.pathname !== '/' && (
                <div className={'position-fixed bottom-0 pb-4'}>
                    <NavLink to={'/'} className={'btn btn-secondary btn-lg rounded-pill border-4'}>
                        <i className={'bi bi-arrow-left'}></i>
                    </NavLink>
                </div>
            )}
        </>
    )
}
