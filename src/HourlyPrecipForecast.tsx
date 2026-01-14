import type { HourlyForecast, Period } from './lib/nws.ts'
import ForecastChart from './ForecastChart.tsx'

export default function HourlyPrecipChart({ hourlyForecast }: { hourlyForecast: HourlyForecast }) {
    return (
        <ForecastChart
            title={'HOURLY PRECIPITATION'}
            colorDomain={[0, 50, 100]}
            colorRange={['rgba(173, 216, 230, 0.6)', 'rgba(100, 149, 237, 0.6)', 'rgba(30, 64, 175, 0.6)']}
            periods={hourlyForecast.periods}
            getX={(p: Period) => p.probabilityOfPrecipitation.value}
            getXLabel={(p: Period) => `${p.probabilityOfPrecipitation.value}%`}
            getForecastLabel={(p) => p.shortForecast}
        />
    )
}
