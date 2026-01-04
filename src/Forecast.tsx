import { createResource } from 'solid-js'
import { useLocation } from '@solidjs/router'

import { getForecast, getPoint } from './lib/nws.ts'
import { getLatLon } from './lib/util.ts'
import LatestObservations from './LatestObservations.tsx'
import ShortForecast from './ShortForecast.tsx'
import DetailedForecast from './DetailedForecaset.tsx'
import ForecastPlaceholder from './ForecastPlaceholder.tsx'
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

    const [forecastResult] = createResource(async () => {
        const point = await getPoint(lat, lon)
        return getForecast(point.properties.forecast)
    })

    return (
        <>
            <LatestObservations point={{ lat, lon }} />
            {forecastResult.loading ? (
                <ForecastPlaceholder />
            ) : (
                <>
                    <ShortForecast forecastResult={forecastResult()} />
                    <DetailedForecast forecastResult={forecastResult()} />
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
