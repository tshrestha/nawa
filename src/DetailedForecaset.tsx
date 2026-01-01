import type { ForecastResult } from './lib/nws.ts'

export default function DetailedForecast({ forecastResult }: { forecastResult?: ForecastResult }) {
    return (
        <div className='card rounded rounded-4 shadow-sm mt-4 mb-4'>
            <div className='card-header'>Detailed Forecast</div>
            <div className='list-group list-group-flush rounded-4'>
                {forecastResult?.properties.periods.map((p: Record<string, string>, index: number) => (
                    <div key={index} className={'list-group-item'}>
                        <h6>{p.name}</h6>
                        <p>{p.detailedForecast}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
