import { denver } from './lib/nws.ts'
import { lazy, useEffect, useState } from 'react'
import { getLocation } from './lib/util.ts'
import LocationSearchForm from './LocationSearchForm.tsx'

const Forecast = lazy(() => import('./Forecast.tsx'))

export default function Home() {
    const [latlon, setLatLon] = useState<{ lat: string; lon: string } | null>(null)
    const [locationResolved, setLocationResolved] = useState(false)

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
                setLatLon({ lat: denver.lat, lon: denver.lon })
            })
            .finally(() => {
                setLocationResolved(true)
            })
    }, [])

    if (!locationResolved) {
        return <div className='text-center mt-4'>Loading...</div>
    }

    return (
        <>
            <Forecast point={{ lat: latlon!.lat, lon: latlon!.lon }} />
            <LocationSearchForm />
        </>
    )
}
