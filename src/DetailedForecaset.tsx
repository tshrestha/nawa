import type { ForecastResult } from './lib/nws.ts'

export default function DetailedForecast({ forecastResult }: { forecastResult?: ForecastResult }) {
    return (
        forecastResult && (
            <div className='card mt-3 mb-3 bg-transparent shadow'>
                <div className='card-header text-bg-dark bg-opacity-50 fw-bolder'>Detailed Forecast</div>
                <div className='list-group list-group-flush'>
                    {forecastResult?.properties.periods.map((p: Record<string, string>, index: number) => (
                        <div
                            key={index}
                            className={'list-group-item text-bg-dark bg-opacity-25 border-dark border-opacity-50'}
                        >
                            <h6 className={'fw-bolder'}>{p.name}</h6>
                            <p className={'fw-light'}>{p.detailedForecast}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    )
}
