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

export function toF(temp: number) {
    return Math.round((temp * 9) / 5 + 32)
}

export async function getPoint(lat: string, lon: string) {
    const response = await fetch(`${weatherURL}/points/${lat},${lon}`)
    if (!response.ok) {
        console.error(`failed to fetch point ${lat},${lon}`)
        return null
    }

    const point = await response.json()
    console.log(point)

    return point
}

export async function getClosestStation(stationsURL: string) {
    const response = await fetch(stationsURL)
    if (!response.ok) {
        console.error('failed to get stations')
        return null
    }

    const stations = (await response.json()) as StationsResult
    console.log(stations.features[0])
    return stations.features[0]
}

export async function getLatestObservations(stationID: string) {
    const response = await fetch(`${weatherURL}/stations/${stationID}/observations/latest`, {
        cache: 'no-store'
    })
    if (!response.ok) {
        console.error('failed to get latest observations')
        return null
    }

    const latestObservations = await response.json()
    console.log(latestObservations)
    return latestObservations
}

export async function getForecast(forecastURL: string) {
    const response = await fetch(forecastURL)
    if (!response.ok) {
        console.error('failed to get forecast')
        return null
    }

    const forecast = (await response.json()) as ForecastResult
    console.log('forecast', forecast)
    return forecast
}
