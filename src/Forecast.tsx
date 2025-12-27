import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

import { type ForecastResult, type Point, getForecast, getPoint } from './nws.ts'

export interface ForecastProps {
    forecastLocation?: Record<string, string>
}

function getLocation(forecastLocation: Record<string, string> | undefined, path: string) {
    if (forecastLocation && Object.keys(forecastLocation).length) {
        return { lat: forecastLocation.lat, lon: forecastLocation.lon }
    }

    const [, , point] = path.split('/')
    const [lat, lon] = point.split(',')

    return { lat: parseFloat(lat).toFixed(4), lon: parseFloat(lon).toFixed(4) }
}

export default function Forecast({ forecastLocation }: ForecastProps) {
    const location = useLocation()
    console.log(location.pathname)
    const { lat, lon } = getLocation(forecastLocation, location.pathname)
    const [forecastResult, setForecastResult] = useState<ForecastResult>()

    useEffect(() => {
        getPoint(lat, lon)
            .then((p: Point): Promise<ForecastResult> => getForecast(p.properties.forecast) as Promise<ForecastResult>)
            .then((f: ForecastResult) => setForecastResult(f))
    }, [lat, lon])

    return (
        <div className={'container mt-3'}>
            <Link to={'/'}>
                <button className={'btn btn-outline-dark'}>
                    <i className={'bi bi-arrow-left'} />
                </button>
            </Link>
            {forecastResult && (
                <>
                    <h3 className={'display-6 mt-4 fs-6'}>
                        Forecast{' '}
                        {Object.keys(forecastLocation as Record<string, string>).length
                            ? `for ${forecastLocation?.display_name}`
                            : ''}
                    </h3>
                    {forecastResult.properties.periods.map((p: Record<string, string>, index: number) => (
                        <div key={index} className={'card mt-3 mb-3'}>
                            <div className='card-body'>
                                <p className={'fw-bold'}>{p.name}</p>
                                <p>{p.detailedForecast}</p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}
