import { denver } from './lib/nws.ts'
import Forecast from './Forecast.tsx'
import LocationSearchForm from './LocationSearchForm.tsx'
import { useEffect, useState } from 'react'
import { getLocation } from './lib/util.ts'

export default function Home() {
    const [latlon, setLatLon] = useState<any>()
    useEffect(() => {
        getLocation().then((geolocation: any) => {
            setLatLon({ lat: geolocation.coords.latitude.toFixed(4), lon: geolocation.coords.longitude.toFixed(4) })
        })
    }, [])
    return (
        <>
            <LocationSearchForm />
            {latlon ? (
                <Forecast point={{ lat: latlon.lat, lon: latlon.lon }} />
            ) : (
                <Forecast point={{ lat: denver.lat, lon: denver.lon }} />
            )}
        </>
    )
}
