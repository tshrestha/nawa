import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

import { type ForecastResult, type Point, getForecast, getPoint } from './nws.ts'
import LatestObservations from './LatestObservations.tsx'
import { type GeocodingResult, reverse } from './geocoding.ts'
import clearday from './assets/weather-icons-master/production/fill/all/clear-day.svg'

function getLatLon(path: string) {
    const segments = path.split('/')
    console.log(segments)

    const point = segments.pop() as string
    console.log(point)

    const [lat, lon] = point.split(',')
    return { lat, lon }
}

export default function Forecast() {
    const location = useLocation()
    console.log(location.pathname)

    const { lat, lon } = getLatLon(location.pathname)
    const [forecastLocation, setForecastLocation] = useState<GeocodingResult>()
    const [forecastResult, setForecastResult] = useState<ForecastResult>()

    useEffect(() => {
        reverse(lat, lon).then((r: GeocodingResult) => setForecastLocation(r))
    }, [lat, lon])

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
            <LatestObservations
                point={{ lat, lon }}
                name={
                    (forecastLocation?.address as Record<string, string>)?.city ||
                    (forecastLocation?.address as Record<string, string>)?.village
                }
            />
            <div className={'mt-3 d-flex flex-row flex-nowrap overflow-auto'}>
                {forecastResult?.properties.periods.map((p: Record<string, string>, index: number) => (
                    <div className={'col-5'} key={index}>
                        <div className='card mx-2 bg-transparent text-bg-dark bg-opacity-25'>
                            <div
                                className='card-header text-center text-bg-dark bg-opacity-25'
                                style={{ height: '66px' }}
                            >
                                <small>{p.name}</small>
                            </div>
                            <img src={clearday} alt='clear day' className='card-img-top img-fluid w-75 mx-auto' />
                            <div className='card-body'>
                                <p className='card-text text-center'>
                                    <small>{p.shortForecast}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {forecastResult?.properties.periods.map((p: Record<string, string>, index: number) => (
                <div key={index} className={'card mt-3 mb-3'}>
                    <div className='card-body'>
                        <p className={'fw-bold'}>{p.name}</p>
                        <p>{p.detailedForecast}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
