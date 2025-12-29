import Fuse, { type FuseResult } from 'fuse.js'

import ClearDay from './assets/weather-icons-master/production/fill/all/clear-day.svg'
import ClearNight from './assets/weather-icons-master/production/fill/all/clear-night.svg'
import Cloudy from './assets/weather-icons-master/production/fill/all/cloudy.svg'
import Overcast from './assets/weather-icons-master/production/fill/all/overcast.svg'
import OvercastDay from './assets/weather-icons-master/production/fill/all/overcast-day.svg'
import OvercastNight from './assets/weather-icons-master/production/fill/all/overcast-night.svg'
import Drizzle from './assets/weather-icons-master/production/fill/all/drizzle.svg'
import Rain from './assets/weather-icons-master/production/fill/all/rain.svg'
import Sleet from './assets/weather-icons-master/production/fill/all/sleet.svg'
import PartlyCloudyDay from './assets/weather-icons-master/production/fill/all/partly-cloudy-day.svg'
import PartlyCloudyNight from './assets/weather-icons-master/production/fill/all/partly-cloudy-night.svg'
import Mist from './assets/weather-icons-master/production/fill/all/mist.svg'
import Thunderstorms from './assets/weather-icons-master/production/fill/all/thunderstorms.svg'
import ThunderstormsDay from './assets/weather-icons-master/production/fill/all/thunderstorms-day.svg'
import ThunderstormsNight from './assets/weather-icons-master/production/fill/all/thunderstorms-night.svg'
import ThunderstormsDayRain from './assets/weather-icons-master/production/fill/all/thunderstorms-day-rain.svg'
import ThunderstormsNightRain from './assets/weather-icons-master/production/fill/all/thunderstorms-night-rain.svg'
import ThunderstormsSnow from './assets/weather-icons-master/production/fill/all/thunderstorms-snow.svg'
import Fog from './assets/weather-icons-master/production/fill/all/fog.svg'
import FogDay from './assets/weather-icons-master/production/fill/all/fog-day.svg'
import FogNight from './assets/weather-icons-master/production/fill/all/fog-night.svg'
import Snow from './assets/weather-icons-master/production/fill/all/snow.svg'
import PartlyCloudyDaySnow from './assets/weather-icons-master/production/fill/all/partly-cloudy-day-snow.svg'
import PartlyCloudyNightSnow from './assets/weather-icons-master/production/fill/all/partly-cloudy-night-snow.svg'

import iconIndexJson from './assets/icon.index.json'

export interface Icon {
    path: string
    keywords: string[]
    day?: boolean
    night?: boolean
    icon: string
}

export const icons = [
    {
        path: './assets/weather-icons-master/production/fill/all/clear-day.svg',
        keywords: ['sunny', 'mostly sunny'],
        day: true,
        night: false,
        icon: ClearDay
    },
    {
        path: './assets/weather-icons-master/production/fill/all/clear-night.svg',
        keywords: ['clear', 'mostly clear'],
        day: false,
        night: true,
        icon: ClearNight
    },
    {
        path: './assets/weather-icons-master/production/fill/all/cloudy.svg',
        keywords: ['cloudy'],
        day: true,
        night: true,
        icon: Cloudy
    },
    {
        path: './assets/weather-icons-master/production/fill/all/overcast.svg',
        keywords: ['overcast'],
        day: true,
        night: true,
        icon: Overcast
    },
    {
        path: './assets/weather-icons-master/production/fill/all/overcast-day.svg',
        keywords: ['overcast'],
        day: true,
        night: false,
        icon: OvercastDay
    },
    {
        path: './assets/weather-icons-master/production/fill/all/overcast-night.svg',
        keywords: ['overcast'],
        day: false,
        night: true,
        icon: OvercastNight
    },
    {
        path: './assets/weather-icons-master/production/fill/all/drizzle.svg',
        keywords: ['drizzle', 'light rain'],
        day: true,
        night: true,
        icon: Drizzle
    },
    {
        path: './assets/weather-icons-master/production/fill/all/rain.svg',
        keywords: ['rain', 'moderate rain'],
        day: true,
        night: true,
        icon: Rain
    },
    {
        path: './assets/weather-icons-master/production/fill/all/sleet.svg',
        keywords: ['sleet', 'freezing rain'],
        day: true,
        night: true,
        icon: Sleet
    },
    {
        path: './assets/weather-icons-master/production/fill/all/partly-cloudy-day.svg',
        keywords: ['partly cloudy', 'mostly cloudy'],
        day: true,
        night: false,
        icon: PartlyCloudyDay
    },
    {
        path: './assets/weather-icons-master/production/fill/all/partly-cloudy-night.svg',
        keywords: ['partly cloudy', 'mostly cloudy'],
        day: false,
        night: true,
        icon: PartlyCloudyNight
    },
    {
        path: './assets/weather-icons-master/production/fill/all/mist.svg',
        keywords: ['mist'],
        day: true,
        night: true,
        icon: Mist
    },
    {
        path: './assets/weather-icons-master/production/fill/all/thunderstorms.svg',
        keywords: ['thunder', 'thunderstorms', 'thunder storms'],
        day: true,
        night: true,
        icon: Thunderstorms
    },
    {
        path: './assets/weather-icons-master/production/fill/all/thunderstorms-day.svg',
        keywords: ['thunder', 'thunderstorms', 'thunder storms'],
        day: true,
        night: false,
        icon: ThunderstormsDay
    },
    {
        path: './assets/weather-icons-master/production/fill/all/thunderstorms-night.svg',
        keywords: ['thunder', 'thunderstorms', 'thunder storms'],
        day: false,
        night: true,
        icon: ThunderstormsNight
    },
    {
        path: './assets/weather-icons-master/production/fill/all/thunderstorms-day-rain.svg',
        keywords: ['thunder', 'thunderstorms', 'thunder storms', 'rain'],
        day: true,
        nigh: false,
        icon: ThunderstormsDayRain
    },
    {
        path: './assets/weather-icons-master/production/fill/all/thunderstorms-night-rain.svg',
        keywords: ['thunder', 'thunderstorms', 'thunder storms', 'rain'],
        day: false,
        night: true,
        icon: ThunderstormsNightRain
    },
    {
        path: './assets/weather-icons-master/production/fill/all/thunderstorms-snow.svg',
        keywords: ['thunder', 'thunderstorms', 'thunder storms', 'snow'],
        day: true,
        night: true,
        icon: ThunderstormsSnow
    },
    {
        path: './assets/weather-icons-master/production/fill/all/fog.svg',
        keywords: ['fog', 'foggy'],
        day: true,
        night: true,
        icon: Fog
    },
    {
        path: './assets/weather-icons-master/production/fill/all/fog-day.svg',
        keywords: ['fog', 'foggy'],
        day: true,
        night: false,
        icon: FogDay
    },
    {
        path: './assets/weather-icons-master/production/fill/all/fog-night.svg',
        keywords: ['fog', 'foggy'],
        day: false,
        night: true,
        icon: FogNight
    },
    {
        path: './assets/weather-icons-master/production/fill/all/snow.svg',
        keywords: ['snow'],
        day: true,
        night: true,
        icon: Snow
    },
    {
        path: './assets/weather-icons-master/production/fill/all/partly-cloudy-day-snow.svg',
        keywords: ['snow', 'chance snow', 'slight chance snow'],
        day: true,
        night: false,
        icon: PartlyCloudyDaySnow
    },
    {
        path: './assets/weather-icons-master/production/fill/all/partly-cloudy-night-snow.svg',
        keywords: ['snow', 'chance snow', 'slight chance snow'],
        day: false,
        night: true,
        icon: PartlyCloudyNightSnow
    }
]

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const iconIndex = Fuse.parseIndex(iconIndexJson)

const fuse = new Fuse(
    icons,
    {
        isCaseSensitive: false,
        keys: ['keywords']
    },
    iconIndex
)

export function getIcon({ keyword, isDay, isNight }: Record<string, string | boolean>) {
    console.log(keyword, `isNight: ${isNight}`, `isDay: ${isDay}`)
    const searchResults: FuseResult<Icon>[] = fuse.search(keyword as string)

    const matchedIcons: Icon[] = searchResults.map((s) => s.item)
    console.log(`matchedIcons`, matchedIcons)

    const filteredIcons = matchedIcons.filter((i) => i.day === isDay && i.night === isNight)
    console.log(`filteredIcons`, filteredIcons)

    return filteredIcons.length ? filteredIcons[0].icon : ClearDay
}
