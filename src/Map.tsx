import 'mapbox-gl/dist/mapbox-gl.css'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import { denver } from './lib/nws.ts'
import { addMapClass, getLocation } from './lib/util.ts'
import { NavLink } from 'react-router'
import { reverse } from './lib/geocoding.ts'

export default function Map() {
    const mapContainerRef = useRef(null)
    const [latlon, setLatLon] = useState<any>()
    const mapRef = useRef<mapboxgl.Map>(null)

    useEffect(() => {
        getLocation()
            .then((geolocation: any) => {
                setLatLon({ lat: geolocation.coords.latitude.toFixed(4), lon: geolocation.coords.longitude.toFixed(4) })
            })
            .catch(() => {
                setLatLon({ lat: denver.lat, lon: denver.lon })
            })
    }, [])

    useEffect(() => {
        if (mapContainerRef.current && latlon) {
            mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
            addMapClass()

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [latlon.lon, latlon.lat],
                zoom: 9
            })

            mapRef.current.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    showAccuracyCircle: true
                }),
                'bottom-right'
            )

            const handleClick = (e: mapboxgl.MapMouseEvent) => {
                const { lat, lng } = e.lngLat
                reverse(lat.toFixed(6), lng.toFixed(6)).then((result) => {
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<a href="#/forecast/${lat.toFixed(4)},${lng.toFixed(4)}">${result.display_name}</a>`)
                        .addTo(mapRef.current as mapboxgl.Map)
                })
            }

            mapRef.current.on('click', handleClick)

            return () => {
                mapRef.current?.off('click', handleClick)
                mapRef.current?.remove()
            }
        }
    }, [latlon])

    return (
        <>
            <div id={'map'} ref={mapContainerRef}></div>
            <div className={'position-fixed bottom-0 mb-5 mx-4'}>
                <NavLink to={'/'} className={'btn btn-secondary btn-lg rounded-pill border-4'}>
                    <i className={'bi bi-arrow-left'}></i>
                </NavLink>
            </div>
        </>
    )
}
