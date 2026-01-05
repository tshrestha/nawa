export const weatherURL = 'https://api.weather.gov'

export const denver = {
    lat: '39.7643918',
    lon: '-105.019559'
}

export interface ForecastResult {
    properties: {
        periods: Record<string, string>[]
    }
}

export interface Point {
    properties: {
        forecast: string
        forecastHourly: string
        forcastGridData: string
        observationStations: string
    }
}

export interface Station {
    properties: {
        stationIdentifier: string
        name: string
    }
}

export interface StationsResult {
    features: Station[]
}

export interface LatestObservations {
    properties: {
        stationName: string
        temperature: {
            value: number
            minValue: number
            maxValue: number
            unitCode: string
        }
        textDescription: string
    }
}

const headers = {
    'User-Agent': 'Elevation Code Works LLC'
}

export function toF(temp: number) {
    return Math.round((temp * 9) / 5 + 32)
}

export async function getPoint(lat: string, lon: string) {
    const response = await fetch(`${weatherURL}/points/${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`, {
        headers
    })
    if (!response.ok) {
        console.error(`failed to fetch point ${lat},${lon}`)
        return null
    }

    return await response.json()
}

export async function getClosestStation(stationsURL: string) {
    const response = await fetch(stationsURL, { headers })
    if (!response.ok) {
        console.error('failed to get stations')
        return null
    }

    const stations = (await response.json()) as StationsResult
    return stations.features[0]
}

export async function getLatestObservations(stationID: string) {
    const response = await fetch(`${weatherURL}/stations/${stationID}/observations/latest`, {
        headers
    })
    if (!response.ok) {
        console.error('failed to get latest observations')
        return null
    }

    return await response.json()
}

export async function getForecast(forecastURL: string) {
    const response = await fetch(forecastURL, { headers })
    if (!response.ok) {
        console.error('failed to get forecast')
        return null
    }

    return await response.json()
}
