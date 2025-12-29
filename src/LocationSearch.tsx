import { useActionState, useState } from 'react'

import LocationSearchForm from './LocationSearchForm.tsx'
import LocationSearchResult from './LocationSearchResult.tsx'
import { type GeocodingResult, geocodingSearch } from './geocoding.ts'

const getSearchResults = async (previousState: string, query: string) => {
    if (query && query !== previousState) {
        return await geocodingSearch(query)
    }
    return [] as GeocodingResult[]
}

export default function LocationSearch() {
    const [query, setQuery] = useState('')
    const [searchResult, searchAction] = useActionState(getSearchResults, null)

    return (
        <>
            <LocationSearchForm location={query} onSearchFieldChange={setQuery} onSearchButtonClick={searchAction} />
            {searchResult && <LocationSearchResult results={searchResult} />}
        </>
    )
}
