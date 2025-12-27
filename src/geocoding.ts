const baseURL = 'https://nominatim.openstreetmap.org'

export type GeocodingResult = Record<
    string,
    string | number | string[] | number[] | Record<string, string | number | string[] | number[]>
>

export async function search(query: string): Promise<GeocodingResult[]> {
    const reqURL = `${baseURL}/search?q=${query}&format=json&addressdetails=1`
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
