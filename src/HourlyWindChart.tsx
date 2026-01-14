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
                'rgba(247,251,255, 0.6)',
                'rgba(222,235,247, 0.6)',
                'rgba(198,219,239, 0.6)',
                'rgba(253,208,162, 0.6)',
                'rgba(253,174,107, 0.6)',
                'rgba(253,141,60, 0.6)',
                'rgba(203,24,29, 0.6)',
                'rgba(165,15,21, 0.6)',
                'rgba(103,0,13, 0.6)',
                'rgba(73,0,106, 0.6)'
            ]}
            periods={hourlyForecast.periods}
            getX={(p: Period) => parseWindSpeed(p.windSpeed)}
            getXLabel={(p: Period) => p.windSpeed}
            getForecastLabel={(p) => `${getWindArrow(p.windDirection)} ${p.windDirection}`}
        />
    )
}
