export const weatherURL = 'https://api.weather.gov'

export const denver = {
    lat: '39.7643918',
    lon: '-105.019559'
}

/**
 * {
 *     "number": 1,
 *     "name": "",
 *     "startTime": "2026-01-11T09:00:00-07:00",
 *     "endTime": "2026-01-11T10:00:00-07:00",
 *     "isDaytime": true,
 *     "temperature": 35,
 *     "temperatureUnit": "F",
 *     "temperatureTrend": null,
 *     "probabilityOfPrecipitation": {
 *         "unitCode": "wmoUnit:percent",
 *         "value": 0
 *     },
 *     "dewpoint": {
 *         "unitCode": "wmoUnit:degC",
 *         "value": -8.333333333333334
 *     },
 *     "relativeHumidity": {
 *         "unitCode": "wmoUnit:percent",
 *         "value": 47
 *     },
 *     "windSpeed": "6 mph",
 *     "windDirection": "SSW",
 *     "icon": "https://api.weather.gov/icons/land/day/sct?size=small",
 *     "shortForecast": "Mostly Sunny",
 *     "detailedForecast": ""
 * }
 */
export interface Period {
    number: number
    name: string
    startTime: string
    endTime: string
    isDaytime: boolean
    temperature: number
    probabilityOfPrecipitation: {
        unitCode: string
        value: number
    }
    dewpoint: {
        unitCode: string
        value: number
    }
    relativeHumidity: {
        unitCode: string
        value: number
    }
    windSpeed: string
    windDirection: string
    shortForecast: string
    detailedForecast: string
    hourString: string
}

export interface HourlyForecast {
    minTemp: number
    maxTemp: number
    periods: Period[]
}

export interface ForecastResult {
    properties: {
        periods: Period[]
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
    const response = await fetch(`${stationsURL}?limit=1`, { headers })
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
    const response = await fetch(`${forecastURL}?units=us`, {
        headers: {
            ...headers
            // 'Feature-Flags': 'forecast_temperature_qv,forecast_wind_speed_qv'
        }
    })
    if (!response.ok) {
        console.error('failed to get forecast')
        return null
    }

    return await response.json()
}
