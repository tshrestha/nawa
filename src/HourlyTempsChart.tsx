import type { HourlyForecast, Period } from './lib/nws.ts'
import ForecastChart from './ForecastChart.tsx'

export default function HourlyTempsChart({ hourlyForecast }: { hourlyForecast: HourlyForecast }) {
    return (
        <ForecastChart
            title={'HOURLY TEMPS'}
            colorDomain={[32, 65, 95]}
            colorRange={['rgba(168, 85, 247, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)']}
            periods={hourlyForecast.periods}
            getX={(p: Period) => p.temperature}
            getXLabel={(p: Period) => `${p.temperature}º`}
            getForecastLabel={(p) => p.shortForecast}
        />
    )
}
