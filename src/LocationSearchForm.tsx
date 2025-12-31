import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { debounce } from 'lodash-es'

import { geocodeSearch } from './geocoding.ts'
import type { Feature } from 'geojson'

export interface LocationSearchFormProps {
    location?: string
    onSearchFieldChange?: (value: string) => void
    onSearchButtonClick?: (location: string) => void
}

export default function LocationSearchForm() {
    const navigate = useNavigate()
    const searchInputRef = useRef(null)
    const [searchResult, setSearchResults] = useState<Feature[]>()

    const [resultNav, setResultNav] = useState({
        maxOffset: searchResult ? searchResult.length - 1 : 0,
        selectionOffset: 0
    })

    const onChange = () => {
        if (searchInputRef.current) {
            const query = (searchInputRef.current as HTMLInputElement).value
            if (query && query.length > 2) {
                const serializedCache = sessionStorage.getItem(query)
                if (serializedCache) {
                    const cached = JSON.parse(serializedCache)
                    console.log('retrieved cached search results', cached)
                    setSearchResults(cached)
                    setResultNav({ ...resultNav, maxOffset: cached.length - 1 })
                } else {
                    debounce(() => {
                        geocodeSearch(query).then(({ features }) => {
                            sessionStorage.setItem(query, JSON.stringify(features))
                            setSearchResults(features)
                            setResultNav({ ...resultNav, maxOffset: features!.length - 1 })
                        })
                    }, 1000)()
                }
            } else {
                setSearchResults([])
                setResultNav({ selectionOffset: 0, maxOffset: 0 })
            }
        }
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (searchResult && searchResult.length) {
            if (e.key === 'Enter') {
                const {
                    properties: {
                        // @ts-ignore
                        coordinates: { latitude, longitude }
                    }
                } = searchResult[resultNav.selectionOffset]
                navigate(`/forecast/${latitude},${longitude}`)
            } else if (e.key === 'ArrowDown') {
                setResultNav({
                    ...resultNav,
                    selectionOffset: resultNav.selectionOffset < resultNav.maxOffset ? resultNav.selectionOffset + 1 : 0
                })
            } else if (e.key === 'ArrowUp') {
                setResultNav({
                    ...resultNav,
                    selectionOffset: resultNav.selectionOffset > 0 ? resultNav.selectionOffset - 1 : resultNav.maxOffset
                })
            } else if (e.key === 'Tab') {
                e.preventDefault()
                setResultNav({
                    ...resultNav,
                    selectionOffset: resultNav.selectionOffset < resultNav.maxOffset ? resultNav.selectionOffset + 1 : 0
                })
            }
        }
    }

    return (
        <div className={'container mt-3 bg-transparent'}>
            <div className='input-group'>
                <input
                    autoComplete={'off'}
                    ref={searchInputRef}
                    id={'geocodingSearch'}
                    type='search'
                    name={'search'}
                    className='form-control rounded-pill text-bg-dark bg-opacity-25 border-light border-opacity-10 shadow'
                    placeholder='Search for a city or place'
                    aria-label='Location'
                    aria-describedby='search'
                    onChange={onChange}
                    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                    // @ts-ignore
                    onKeyDown={onKeyDown}
                />
            </div>
            <div
                id='suggestions'
                className={`list-group list-group-flush rounded rounded-3 position-absolute shadow w-75 ${searchResult?.length ? '' : 'd-none'}`}
                style={{ zIndex: 1000 }}
            >
                {searchResult?.map((feature, i) => (
                    <Link
                        key={feature.id}
                        className={`list-group-item list-group-item-action text-bg-dark bg-opacity-75 border-dark border-opacity-50 search-result ${i === resultNav.selectionOffset ? 'active' : ''}`}
                        to={`/forecast/${feature.properties?.coordinates.latitude},${feature.properties?.coordinates.longitude}`}
                    >
                        {feature.properties?.full_address}
                    </Link>
                ))}
            </div>
        </div>
    )
}
