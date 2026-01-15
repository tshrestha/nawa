import { createSignal, For, Match, Switch } from 'solid-js'

import type { HourlyForecast } from './lib/nws.ts'
import HourlyTempsChart from './HourlyTempsChart.tsx'
import HourlyPrecipChart from './HourlyPrecipForecast.tsx'
import HourlyWindChart from './HourlyWindChart.tsx'

export interface ForecastType {
    name: string
    id: string
    isSelected: boolean
}

export default function HourlyForecast({ hourlyForecast }: { hourlyForecast: HourlyForecast }) {
    const [forecastType, setForecastType] = createSignal<ForecastType[]>([
        { name: 'TEMP', id: 'forecast-temp', isSelected: true },
        { name: 'PRECIP %', id: 'forecast-precip', isSelected: false },
        { name: 'WIND', id: 'forecast-wind', isSelected: false }
    ])

    const onClick = (type: ForecastType) => {
        const types = [...forecastType()]
        types.forEach((t) => {
            t.isSelected = t.id === type.id
        })
        setForecastType(types)
    }

    return (
        <>
            <Switch>
                <Match when={forecastType().find((f) => f.isSelected)?.id === 'forecast-temp'}>
                    <HourlyTempsChart hourlyForecast={hourlyForecast} />
                </Match>
                <Match when={forecastType().find((f) => f.isSelected)?.id === 'forecast-precip'}>
                    <HourlyPrecipChart hourlyForecast={hourlyForecast} />
                </Match>
                <Match when={forecastType().find((f) => f.isSelected)?.id === 'forecast-wind'}>
                    <HourlyWindChart hourlyForecast={hourlyForecast} />
                </Match>
            </Switch>
            <div class='btn-group mt-1 mb-4 bg-body' role='group' aria-label='Forecast type selector'>
                <For each={forecastType()}>
                    {(type) => (
                        <>
                            <input
                                type='radio'
                                class='btn-check'
                                name='btnradio'
                                id={type.id}
                                autocomplete='off'
                                checked={type.isSelected}
                                onclick={() => onClick(type)}
                            />
                            <label class='btn btn-outline-primary' for={type.id}>
                                {type.name}
                            </label>
                        </>
                    )}
                </For>
            </div>
        </>
    )
}
