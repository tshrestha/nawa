import { createContext, type Dispatch, type SetStateAction } from 'react'

export interface ForecastLocationContext {
    forecastLocation: Record<string, string>
    setForecastLocation: Dispatch<SetStateAction<Record<string, string>>>
}

export const ForecastLocationContext = createContext<ForecastLocationContext>({
    forecastLocation: {},
    setForecastLocation: () => {}
})
