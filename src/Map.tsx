import 'maplibre-gl/dist/maplibre-gl.css'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'

import { denver } from './lib/nws.ts'
import { getLocation } from './lib/util.ts'
import { NavLink } from 'react-router'
import { reverse } from './lib/geocoding.ts'

export default function Map() {
    const mapContainerRef = useRef(null)
    const [latlon, setLatLon] = useState<any>()
    const mapRef = useRef<maplibregl.Map>(null)

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
            mapRef.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://tiles.openfreemap.org/styles/bright',
                center: [latlon.lon, latlon.lat],
                zoom: 9,
                attributionControl: false
            })

            mapRef.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'top-left')

            mapRef.current.addControl(
                new maplibregl.NavigationControl({
                    showCompass: true
                }),
                'bottom-right'
            )

            mapRef.current.addControl(
                new maplibregl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    showAccuracyCircle: true
                }),
                'bottom-right'
            )

            const handleClick = (e: maplibregl.MapMouseEvent) => {
                const { lat, lng } = e.lngLat
                reverse(lat.toFixed(6), lng.toFixed(6)).then((result) => {
                    new maplibregl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<a href="#/forecast/${lat.toFixed(4)},${lng.toFixed(4)}">${result.display_name}</a>`)
                        .addTo(mapRef.current as maplibregl.Map)
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
            <div id={'map'} className={'position-fixed top-0 start-0 z-2'} ref={mapContainerRef}></div>
            <div className={'position-fixed bottom-0 start-0 mb-3 mx-3 z-3'}>
                <NavLink to={'/'} className={'btn btn-secondary btn-lg rounded-pill border-4'}>
                    <i className={'bi bi-arrow-left'}></i>
                </NavLink>
            </div>
        </>
    )
}
