import { useEffect, useState } from 'react'

import { denver } from './lib/nws.ts'
import { getLocation } from './lib/util.ts'
import LocationSearchForm from './LocationSearchForm.tsx'
import Forecast from './Forecast.tsx'

export default function Home() {
    const [latlon, setLatLon] = useState<{ lat: string; lon: string }>({ lat: denver.lat, lon: denver.lon })

    useEffect(() => {
        getLocation()
            .then((geolocation) => {
                const pos = geolocation as GeolocationPosition
                setLatLon({
                    lat: pos.coords.latitude.toFixed(4),
                    lon: pos.coords.longitude.toFixed(4)
                })
            })
            .catch(() => {
                console.log('location not allowed, using default location', denver)
            })
    }, [])

    return (
        <>
            <Forecast point={{ lat: latlon.lat, lon: latlon.lon }} />
            <LocationSearchForm />
        </>
    )
}
