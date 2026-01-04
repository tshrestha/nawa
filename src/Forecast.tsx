import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import { type ForecastResult, type Point, getForecast, getPoint } from './lib/nws.ts'
import LatestObservations from './LatestObservations.tsx'
import ShortForecast from './ShortForecast.tsx'
import DetailedForecast from './DetailedForecaset.tsx'
import { getLatLon } from './lib/util.ts'
import ForecastPlaceholder from './lib/ForecastPlaceholder.tsx'
import HomeButton from './HomeButton.tsx'

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
                <ForecastPlaceholder />
            ) : (
                <>
                    <ShortForecast forecastResult={forecastResult!} />
                    <DetailedForecast forecastResult={forecastResult} />
                </>
            )}
            {location.pathname !== '/' && (
                <div className={'position-fixed bottom-0 pb-4'}>
                    <HomeButton />
                </div>
            )}
        </>
    )
}
