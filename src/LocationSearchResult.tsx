import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { ForecastLocationContext } from './ForecastLocationContext.ts'

export interface LocationSearchResultProps {
    results: Record<string, string>[]
}

export default function LocationSearchResult({ results }: LocationSearchResultProps) {
    const navigate = useNavigate()
    const { setForecastLocation } = useContext(ForecastLocationContext)

    const onClick = (location: Record<string, string>) => {
        setForecastLocation(location)
        navigate(`/forecast/${location.lat},${location.lon}`, { replace: true })
    }

    return (
        <div className={'container mt-3'}>
            <hr />
            <h1 className={'display-6 fs-6'}>Location Results</h1>
            <div className='list-group mb-4'>
                {results.map((r) => (
                    <a
                        key={r.place_id}
                        href='#'
                        onClick={() => onClick(r)}
                        className='list-group-item list-group-item-action mb-2 text-bg-light bg-opacity-10 rounded rounded-pill border-light border-opacity-10 shadow-sm'
                    >
                        {r.display_name}
                    </a>
                ))}
            </div>
        </div>
    )
}
