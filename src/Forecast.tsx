import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

import { type ForecastResult, type Point, getForecast, getPoint } from './lib/nws.ts'
import LatestObservations from './LatestObservations.tsx'
import { type GeocodingResult, reverse } from './lib/geocoding.ts'
import ShortForecast from './ShortForecast.tsx'
import DetailedForecast from './DetailedForecaset.tsx'

function getLatLon(path: string) {
    const segments = path.split('/')
    console.log(segments)

    const point = segments.pop() as string
    console.log(point)

    const [lat, lon] = point.split(',')
    return { lat, lon }
}

export interface ForecastProps {
    point?: {
        lat: string
        lon: string
    }
}

export default function Forecast({ point }: ForecastProps) {
    const location = useLocation()
    console.log(location.pathname)
    let lat, lon

    if (point) {
        lat = point.lat
        lon = point.lon
    } else {
        const latlon = getLatLon(location.pathname)
        lat = latlon.lat
        lon = latlon.lon
    }

    const [forecastLocation, setForecastLocation] = useState<GeocodingResult>()
    const [forecastResult, setForecastResult] = useState<ForecastResult>()

    useEffect(() => {
        reverse(lat, lon).then((r: GeocodingResult) => setForecastLocation(r))
    }, [])

    useEffect(() => {
        getPoint(lat, lon)
            .then((p: Point): Promise<ForecastResult> => getForecast(p.properties.forecast) as Promise<ForecastResult>)
            .then((f: ForecastResult) => setForecastResult(f))
    }, [])

    return (
        <div className={'container mt-3'}>
            {location.pathname !== '/' && (
                <Link to={'/'}>
                    <button className={'btn btn-outline-dark'}>
                        <i className={'bi bi-arrow-left'} />
                    </button>
                </Link>
            )}
            <LatestObservations
                point={{ lat, lon }}
                name={
                    (forecastLocation?.address as Record<string, string>)?.city ||
                    (forecastLocation?.address as Record<string, string>)?.village
                }
            />
            <ShortForecast forecastResult={forecastResult} />
            <DetailedForecast forecastResult={forecastResult} />
        </div>
    )
}
