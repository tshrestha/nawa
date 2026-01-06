import { getIcon } from './lib/wicons.ts'
import type { ForecastResult } from './lib/nws.ts'
import windIcon from './assets/weather-icons-master/production/fill/all/wind.svg'

export default function ShortForecast({ forecastResult }: { forecastResult: ForecastResult }) {
    return (
        <div class='list-group rounded-4 shadow-sm mb-4'>
            {forecastResult?.properties.periods.map((p, i) => (
                <div class='list-group-item d-flex justify-content-between align-items-center'>
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
            ))}
        </div>
    )
}
