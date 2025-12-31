import { getIcon } from './lib/wicons.ts'
import type { ForecastResult } from './lib/nws.ts'

function getTimeOfDay(phrase: string) {
    const nightPattern = /[Nn]ight/
    const dayPattern = /([Dd]ay)|[Aa]fternoon/
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    if (nightPattern.test(phrase)) {
        return { isDay: false, isNight: true }
    }

    if (days.includes(phrase) || dayPattern.test(phrase)) {
        return { isDay: true, isNight: false }
    }

    return { isNight: true, isDay: true }
}

export default function ShortForecast({ forecastResult }: { forecastResult?: ForecastResult }) {
    return (
        forecastResult && (
            <div className={'mt-3 d-flex flex-row flex-nowrap overflow-auto'}>
                {forecastResult?.properties.periods.map((p: Record<string, string>, i: number) => (
                    <div className={'col-3'} key={i}>
                        <div className={`card  bg-transparent text-bg-dark border-0`}>
                            <div className={'card-header text-center border-0 bg-transparent pb-0'}>
                                <small>{p.name}</small>
                            </div>
                            <img
                                src={getIcon({ keyword: p.shortForecast, ...getTimeOfDay(p.name) })}
                                alt='clear day'
                                className='card-img-top img-fluid w-50 mx-auto'
                            />
                            <div className='card-body text-center pt-0'>
                                <p className='card-text'>
                                    <small>{p.shortForecast}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    )
}
