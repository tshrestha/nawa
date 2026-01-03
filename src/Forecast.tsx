import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

import { reverseGeocodeSearch } from './lib/geocoding.ts'
import { type ForecastResult, type Point, getForecast, getPoint } from './lib/nws.ts'
import LatestObservations from './LatestObservations.tsx'
import ShortForecast from './ShortForecast.tsx'
import DetailedForecast from './DetailedForecaset.tsx'
import { getLatLon, removeMapClass } from './lib/util.ts'
import type { Feature } from 'geojson'

export interface ForecastProps {
    point?: {
        lat: string
        lon: string
    }
}

export default function Forecast({ point }: ForecastProps) {
    removeMapClass()
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

    const [forecastLocation, setForecastLocation] = useState<Feature>()
    const [forecastResult, setForecastResult] = useState<ForecastResult>()

    useEffect(() => {
        reverseGeocodeSearch(lat, lon).then((r: Feature | null) => {
            if (r) {
                setForecastLocation(r)
            }
        })
    }, [point])

    useEffect(() => {
        getPoint(lat, lon)
            .then((p: Point): Promise<ForecastResult> => getForecast(p.properties.forecast) as Promise<ForecastResult>)
            .then((f: ForecastResult) => setForecastResult(f))
    }, [point])

    return (
        <>
            {location.pathname !== '/' && (
                <Link to={'/'}>
                    <button className={'btn btn-outline-dark'}>
                        <i className={'bi bi-arrow-left'} />
                    </button>
                </Link>
            )}
            {forecastLocation && <LatestObservations point={{ lat, lon }} name={forecastLocation.properties?.name} />}
            {forecastResult && (
                <>
                    <ShortForecast forecastResult={forecastResult} />
                    <DetailedForecast forecastResult={forecastResult} />
                </>
            )}
        </>
    )
}
