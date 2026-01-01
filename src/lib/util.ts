const abbreviatedDay: Record<string, string> = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat'
}

export function getTimeOfDay(phrase: string) {
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

export function getLatLon(path: string) {
    const segments = path.split('/')
    const point = segments.pop() as string
    const [lat, lon] = point.split(',')
    return { lat, lon }
}

export function toAbbreviatedDay(day: string): string {
    return abbreviatedDay[day]
}
