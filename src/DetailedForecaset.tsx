import type { ForecastResult } from './lib/nws.ts'
import { getIcon } from './lib/wicons.ts'
import { getPrecipType } from './lib/util.ts'
import windIcon from './assets/weather-icons-master/production/fill/all/wind.svg'
import raindropIcon from './assets/weather-icons-master/production/fill/all/raindrop.svg'
import snowflakeIcon from './assets/weather-icons-master/production/fill/all/snowflake.svg'

export default function DetailedForecast({ forecastResult }: { forecastResult?: ForecastResult }) {
    return (
        <div className='card rounded rounded-4 shadow-sm mt-4 mb-4'>
            <div className='card-header'>Detailed Forecast</div>
            <div className='list-group list-group-flush rounded-4'>
                {forecastResult?.properties.periods.map((p: Record<string, string>, index: number) => (
                    <div key={index} className={'list-group-item'}>
                        <div className={'d-flex justify-content-between align-items-center mb-3'}>
                            <div className={'col-2 fw-medium'}>
                                {`${new Date(p.startTime).toLocaleDateString('en-US', { weekday: 'short' })}${p.isDaytime ? '' : ' night'}`}
                            </div>
                            <div className={'col-1 text-start'}>
                                <img
                                    src={getIcon({
                                        keyword: p.shortForecast,
                                        isDay: p.isDaytime,
                                        isNight: !p.isDaytime
                                    })}
                                    alt={p.shortForecast}
                                    className='img-fluid'
                                />
                            </div>
                            <div className={'col-1 text-end ms-4'}>
                                <img src={windIcon} alt='wind icon' className='img-fluid' />
                            </div>
                            <div className={'col-3 text-start'}>
                                <small>{p.windSpeed.replace('to', '-')}</small>
                            </div>
                            <div className={'col-1 text-end'}>
                                {getPrecipType(p.detailedForecast) === 'snow' && (
                                    <img src={snowflakeIcon} alt='precipatation' className='img-fluid' />
                                )}
                                {getPrecipType(p.detailedForecast) === 'rain' && (
                                    <img src={raindropIcon} alt='precipatation' className='img-fluid' />
                                )}
                            </div>
                            <div className={'col-2 text-start'}>
                                <small>{
                                    // @ts-ignore
                                    `${p.probabilityOfPrecipitation['value']}%`
                                }</small>
                            </div>
                            <div className={'col-auto text-end fw-medium'}>{p.temperature}º</div>
                        </div>
                        <p>{p.detailedForecast}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
