import { denver } from './lib/nws.ts'
import { lazy, useEffect, useState } from 'react'
import { getLocation, removeMapClass } from './lib/util.ts'
import LocationSearchForm from './LocationSearchForm.tsx'

const Forecast = lazy(() => import('./Forecast.tsx'))

export default function Home() {
    removeMapClass()
    const [latlon, setLatLon] = useState<any>()
    useEffect(() => {
        getLocation().then((geolocation: any) => {
            setLatLon({ lat: geolocation.coords.latitude.toFixed(4), lon: geolocation.coords.longitude.toFixed(4) })
        })
    }, [])
    return (
        <>
            {latlon ? (
                <Forecast point={{ lat: latlon.lat, lon: latlon.lon }} />
            ) : (
                <Forecast point={{ lat: denver.lat, lon: denver.lon }} />
            )}
            <LocationSearchForm />
        </>
    )
}
