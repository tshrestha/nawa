import { useActionState, useState } from 'react'

import LocationSearchForm from './LocationSearchForm.tsx'
import LocationSearchResult from './LocationSearchResult.tsx'
import { search } from './geocoding.ts'

const getGeocoding = async (previousState: string, location: string) => {
    if (location && location !== previousState) {
        return await search(location)
    }
    return []
}

export default function LocationSearch() {
    const [location, setLocation] = useState('')
    const [searchResult, searchAction] = useActionState(getGeocoding, location)

    return (
        <>
            <LocationSearchForm
                location={location}
                onSearchFieldChange={setLocation}
                onSearchButtonClick={searchAction}
            />
            {searchResult && <LocationSearchResult results={searchResult} />}
        </>
    )
}
