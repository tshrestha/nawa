import type { HourlyForecast, Period } from './lib/nws.ts'
import ForecastChart from './ForecastChart.tsx'

function parseWindSpeed(windSpeed: string): number {
    const match = windSpeed.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 0
}

// Maps wind direction to arrow showing where wind is blowing TO
function getWindArrow(direction: string): string {
    const arrows: Record<string, string> = {
        N: '↓',
        S: '↑',
        E: '←',
        W: '→',
        NE: '↙',
        NW: '↘',
        SE: '↖',
        SW: '↗',
        NNE: '↙',
        NNW: '↘',
        SSE: '↖',
        SSW: '↗',
        ENE: '↙',
        ESE: '↖',
        WNW: '↘',
        WSW: '↗'
    }
    return arrows[direction] || '○'
}

export default function HourlyWindChart({ hourlyForecast }: { hourlyForecast: HourlyForecast }) {
    return (
        <ForecastChart
            title={'HOURLY WIND'}
            colorDomain={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]}
            colorRange={[
                '#6b8e6b', // 0 mph - sage green (calm)
                '#5a9178', // 10 mph
                '#4a9485', // 20 mph
                '#d4a843', // 30 mph - golden (moderate)
                '#d4883a', // 40 mph
                '#d46832', // 50 mph - orange (strong)
                '#c94a2a', // 60 mph
                '#b33025', // 70 mph - red (severe)
                '#8b1a1a', // 80 mph
                '#5c1a5c', // 90+ mph - deep purple (extreme)
            ]}
            classList={['condies-bg-light-sage']}
            periods={hourlyForecast.periods}
            getX={(p: Period) => parseWindSpeed(p.windSpeed)}
            getXLabel={(p: Period) => p.windSpeed}
            getForecastLabel={(p) => `${getWindArrow(p.windDirection)} ${p.windDirection}`}
        />
    )
}
