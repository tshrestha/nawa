import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { ForecastLocationContext } from './ForecastLocationContext.ts'
import type { GeocodingResult } from './geocoding.ts'

export interface LocationSearchResultProps {
    results: GeocodingResult[]
}

export default function LocationSearchResult({ results }: LocationSearchResultProps) {
    const navigate = useNavigate()
    const { setForecastLocation } = useContext(ForecastLocationContext)

    const onClick = (location: GeocodingResult) => {
        setForecastLocation(location)
        navigate(`/forecast/${location.lat},${location.lon}`, { replace: true })
    }

    return (
        <div className={'container mt-3'}>
            <hr />
            <h1 className={'display-6 fs-6 text-bg-dark bg-transparent'}>Location Results</h1>
            <div className='list-group mb-4'>
                {results.map((r: GeocodingResult) => (
                    <a
                        key={r.place_id as string}
                        href='#'
                        onClick={() => onClick(r)}
                        className='list-group-item list-group-item-action px-4 fs-6 mb-2 text-bg-dark text-opacity-10 bg-opacity-25 rounded rounded-pill border-light border-opacity-10 shadow-sm'
                    >
                        {r.display_name as string}
                    </a>
                ))}
            </div>
        </div>
    )
}
