import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { GeocodingResult } from './geocoding.ts'

export interface ForecastLocationContext {
    forecastLocation: GeocodingResult
    setForecastLocation: Dispatch<SetStateAction<GeocodingResult>>
}

export const ForecastLocationContext = createContext<ForecastLocationContext>({
    forecastLocation: {},
    setForecastLocation: () => {}
})
