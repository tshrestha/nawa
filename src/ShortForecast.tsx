import { Show } from 'solid-js'

import { getIcon } from './lib/wicons.ts'
import type { ForecastResult } from './lib/nws.ts'
import windIcon from './assets/weather-icons-master/production/fill/all/wind.svg'

function isPrimo(condies: Record<string, string | number | boolean>) {
    const { shortForecast, isDaytime, windSpeed, temperature } = condies
    if (!isDaytime) {
        return false
    }
    if ((temperature as number) < 52 || (temperature as number) > 75) {
        return false
    }

    const minMaxWind = (windSpeed as string).match(/(\d)+/g)
    if (minMaxWind && minMaxWind.length) {
        if (minMaxWind.length === 1 && parseInt(minMaxWind[0], 10) > 15) {
            return false
        }

        if (parseInt(minMaxWind[1], 10) > 15) {
            return false
        }
    }

    const p = /(mostly\s)?sunny/g
    return p.test((shortForecast as string).toLowerCase())
}

export default function ShortForecast({ forecastResult }: { forecastResult: ForecastResult }) {
    return (
        <div class='list-group rounded-4 shadow-sm mb-4'>
            {forecastResult?.properties.periods.map((p, i) => (
                <div class='list-group-item'>
                    <div class={'d-flex justify-content-between align-items-center'}>
                        {i <= 1 && <div class={'col-3 fw-medium'}>{p.name}</div>}
                        {i > 1 && (
                            <div
                                class={'col-3 fw-medium'}
                            >{`${new Date(p.startTime).toLocaleDateString('en-US', { weekday: 'short' })}${p.isDaytime ? '' : ' night'}`}</div>
                        )}
                        <div class={'col-1 text-start'}>
                            <img
                                src={getIcon({ keyword: p.shortForecast, isDay: p.isDaytime, isNight: !p.isDaytime })}
                                alt={p.shortForecast}
                                class='img-fluid'
                            />
                        </div>
                        <div class={'col-1 text-end'}>
                            <img src={windIcon} alt='clear day' class='img-fluid' />
                        </div>
                        <div class={'col-3 text-start'}>
                            <small>{p.windSpeed.replace('to', '-')}</small>
                        </div>
                        <div class={'col-auto text-end fw-medium'}>{p.temperature}º</div>
                    </div>
                    <Show when={isPrimo(p)}>
                        <div class={'d-flex justify-content-center my-2'}>
                            <span class='badge rounded-pill text-bg-warning fw-bolder text-center py-2 px-3'>
                                <i>️PRIMO CONDIES!!!</i>
                            </span>
                        </div>
                    </Show>
                </div>
            ))}
        </div>
    )
}
