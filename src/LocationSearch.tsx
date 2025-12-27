import { useActionState, useState } from 'react'

import LocationSearchForm from './LocationSearchForm.tsx'
import LocationSearchResult from './LocationSearchResult.tsx'

const geocodingURL = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1'

const getGeocoding = async (previousState: string, location: string) => {
    if (location && location !== previousState) {
        const reqURL = `${geocodingURL}&q=${location}`

        const cachedGeocodingStr = localStorage.getItem(reqURL)
        if (cachedGeocodingStr) {
            const cachedGeocoding = JSON.parse(cachedGeocodingStr)
            console.log('geocoding retrieved from cache')
            console.log(cachedGeocoding)
            return cachedGeocoding
        }

        const response = await fetch(reqURL, {
            method: 'GET',
            headers: {
                'User-Agent': 'Elevation Code Works LLC'
            }
        })
        if (!response.ok) {
            console.error('request failed')
            return []
        }

        const result = await response.json()
        localStorage.setItem(reqURL, JSON.stringify(result))
        console.log(result)
        return result
    }
    return []
}

export default function LocationSearch() {
    const [location, setLocation] = useState('')
    const [searchResult, searchAction] = useActionState(getGeocoding, location)

    return (
        <>
            <LocationSearchForm
                location={location}
                onSearchFieldChange={setLocation}
                onSearchButtonClick={searchAction}
            />
            {searchResult && <LocationSearchResult results={searchResult} />}
        </>
    )
}
