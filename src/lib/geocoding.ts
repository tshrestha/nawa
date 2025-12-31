import type { FeatureCollection } from 'geojson'

const baseURL = 'https://nominatim.openstreetmap.org'
const geocodingURL = `${import.meta.env.VITE_GEOCODE_URL}/.netlify/functions/geocoding/forward`

export type GeocodingResult = Record<
    string,
    string | number | string[] | number[] | Record<string, string | number | string[] | number[]>
>

export async function geocodeSearch(query: string): Promise<Partial<FeatureCollection>> {
    const response = await fetch(`${geocodingURL}?q=${query}`, {
        method: 'GET',
        headers: {
            'X-Nawa-Token': import.meta.env.VITE_NAWA_TOKEN
        }
    })
    if (!response.ok) {
        console.error('geocode search failed')
        return {}
    }
    return await response.json()
}

export async function geocodingSearch(query: string) {
    const reqURL = `${baseURL}/search?q=${query}&format=json&addressdetails=1&countrycodes=us`
    const cached = localStorage.getItem(reqURL)

    if (cached) {
        const cachedGeocoding = JSON.parse(cached)
        console.log('geocoding search result retrieved from cache')
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
        console.error('geocoding search request failed')
        return []
    }

    const result = await response.json()
    localStorage.setItem(reqURL, JSON.stringify(result))

    console.log(result)
    return result
}

export async function reverse(lat: string, lon: string): Promise<GeocodingResult> {
    const reqURL = `${baseURL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
    const cached = localStorage.getItem(reqURL)

    if (cached) {
        const cachedResult = JSON.parse(cached)
        console.log('geocoding reverse lookup retrieved from cache')
        console.log(cachedResult)
        return cachedResult
    }

    const response = await fetch(reqURL, {
        method: 'GET',
        headers: {
            'User-Agent': 'Elevation Code Works LLC'
        }
    })

    if (!response.ok) {
        console.error('geocoding reverse lookup request failed')
        return {}
    }

    const result = await response.json()
    localStorage.setItem(reqURL, JSON.stringify(result))

    console.log(result)
    return result
}
