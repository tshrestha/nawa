export function getLatLon(path: string) {
    const segments = path.split('/')
    const point = segments.pop() as string
    const [lat, lon] = point.split(',')
    return { lat, lon }
}

export function getPrecipType(forecast: string) {
    const tokens = forecast.toLowerCase().split(' ')
    return tokens.includes('snow') ? 'snow' : 'rain'
}

export function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (p) => {
                console.log('Geolocation', p)
                resolve(p)
            },
            (e) => {
                console.error(e)
                reject(e)
            },
            { enableHighAccuracy: true, timeout: 5000 }
        )
    })
}

export function getTimeOfDay() {
    const date = new Date()
    const hours = date.getHours()

    if (hours >= 5 && hours < 9) {
        return 'morning'
    }

    if (hours >= 9 && hours < 17) {
        return 'day'
    }

    if (hours >= 17 && hours < 20) {
        return 'evening'
    }

    return 'night'
}
