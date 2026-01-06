import { Show, Suspense } from 'solid-js'
import { createAsync, query, type RouteSectionProps, useLocation, useParams } from '@solidjs/router'

import { getForecast, getPoint } from './lib/nws.ts'

import LatestObservations from './LatestObservations.tsx'
import ShortForecast from './ShortForecast.tsx'
import DetailedForecast from './DetailedForecaset.tsx'
import ForecastPlaceholder from './ForecastPlaceholder.tsx'
import HomeButton from './HomeButton.tsx'
import LatestObservationsPlaceholder from './LatestObservationsPlaceholder.tsx'
import SunRiseSet from './SunRiseSet.tsx'

export interface ForecastProps {
    point?: {
        lat: string
        lon: string
    }
}

const getData = query(async (lat, lon) => {
    const point = await getPoint(lat, lon)
    const forecast = await getForecast(point.properties.forecast)
    return { point, forecast }
}, 'forecast')

export default function Forecast(props: ForecastProps | RouteSectionProps) {
    const location = useLocation()
    const params = useParams()
    let lat, lon

    if ((props as ForecastProps).point) {
        lat = (props as ForecastProps).point!.lat
        lon = (props as ForecastProps).point!.lon
    } else {
        const point = params.point?.split(',')
        lat = point![0]
        lon = point![1]
    }

    const data = createAsync(() => getData(lat, lon))

    return (
        <>
            <Suspense fallback={<LatestObservationsPlaceholder />}>
                <Show when={data()}>
                    <LatestObservations point={data()!.point} />
                </Show>
            </Suspense>
            <SunRiseSet lat={lat} lon={lon} />
            <Suspense fallback={<ForecastPlaceholder />}>
                <Show when={data()}>
                    <ShortForecast forecastResult={data()!.forecast} />
                    <DetailedForecast forecastResult={data()!.forecast} />
                </Show>
            </Suspense>
            <Show when={location.pathname !== '/'}>
                <div class={'position-fixed bottom-0 pb-4'}>
                    <HomeButton />
                </div>
            </Show>
        </>
    )
}
