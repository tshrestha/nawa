import { Link } from 'react-router'
import type { GeocodingResult } from './geocoding.ts'

export interface LocationSearchResultProps {
    results: GeocodingResult[]
}

export default function LocationSearchResult({ results }: LocationSearchResultProps) {
    return (
        <div className={'container mt-3'}>
            <hr />
            <h1 className={'display-6 fs-6 text-bg-dark bg-transparent'}>Location Results</h1>
            <div className='list-group mb-4'>
                {results.map((r: GeocodingResult) => (
                    <Link
                        to={`/forecast/${r.lat},${r.lon}`}
                        key={r.place_id as string}
                        className='list-group-item list-group-item-action px-4 fs-6 mb-2 text-bg-dark text-opacity-10 bg-opacity-25 rounded rounded-pill border-light border-opacity-10 shadow-sm'
                    >
                        {r.display_name as string}
                    </Link>
                ))}
            </div>
        </div>
    )
}
