import { getIcon } from './lib/wicons.ts'
import { getTimeOfDay } from './lib/util.ts'
import type { ForecastResult } from './lib/nws.ts'
import windIcon from './assets/weather-icons-master/production/fill/all/wind.svg'

export default function ShortForecast({ forecastResult }: { forecastResult: ForecastResult }) {
    console.log('forecastResult', forecastResult)
    return (
        <div className='list-group rounded-4 shadow-sm mt-4 mb-4'>
            {forecastResult?.properties.periods.map((p, i) => (
                <div key={i} className='list-group-item d-flex justify-content-between align-items-center'>
                    {i <= 1 && <div className={'col-3 fw-medium'}>{p.name}</div>}
                    {i > 1 && (
                        <div
                            className={'col-3 fw-medium'}
                        >{`${new Date(p.startTime).toLocaleDateString('en-US', { weekday: 'short' })}${p.isDaytime ? '' : ' night'}`}</div>
                    )}
                    <div className={'col-1 text-start'}>
                        <img
                            src={getIcon({ keyword: p.shortForecast, ...getTimeOfDay(p.name) })}
                            alt={p.shortForecast}
                            className='img-fluid'
                        />
                    </div>
                    <div className={'col-1 text-end'}>
                        <img src={windIcon} alt='clear day' className='img-fluid' />
                    </div>
                    <div className={'col-3 text-start'}>
                        <small>{p.windSpeed.replace('to', '-')}</small>
                    </div>
                    <div className={'col-auto text-end fw-medium'}>{p.temperature}º</div>
                </div>
            ))}
        </div>
    )
}
