import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { debounce } from 'lodash-es'

import type { Feature } from 'geojson'
import { geocodeSearch } from './lib/geocoding.ts'
import { addItem, getItem, setItem } from './lib/cache.ts'

const savedSelectionsCollectionKey = 'nawaSavedSelections'

export default function LocationSearchForm() {
    const navigate = useNavigate()
    const searchInputRef = useRef(null)
    const [searchResults, setSearchResults] = useState<Feature[]>()
    const [searchResultsVisible, setSearchResultsVisible] = useState(false)

    const [resultNav, setResultNav] = useState({
        maxOffset: searchResults ? searchResults.length - 1 : 0,
        selectionOffset: 0
    })

    const saveSelection = (selection: any) => {
        addItem(savedSelectionsCollectionKey, selection)
        console.log('saved selection', selection)
    }

    const loadSavedSelections = () => {
        const savedSelections = getItem(savedSelectionsCollectionKey)
        if (savedSelections) {
            setSearchResults(savedSelections)
        }
    }

    const onFocus = () => {
        loadSavedSelections()
        setSearchResultsVisible(true)
    }

    const onBlur = (e: React.FocusEvent) => {
        if (!(e.relatedTarget as HTMLElement)?.classList.contains('search-result')) {
            setSearchResultsVisible(false)
        }
    }

    const onChange = () => {
        if (searchInputRef.current) {
            const query = (searchInputRef.current as HTMLInputElement).value
            if (query && query.length > 2) {
                const cached = getItem(query)
                if (cached) {
                    console.log('retrieved cached search results', cached)
                    setSearchResults(cached)
                    setResultNav({ ...resultNav, maxOffset: cached.length - 1 })
                } else {
                    debounce(() => {
                        geocodeSearch(query).then(({ features }) => {
                            setItem(query, features)
                            setSearchResults(features)
                            setResultNav({ ...resultNav, maxOffset: features!.length - 1 })
                        })
                    }, 300)()
                }
            } else {
                setSearchResults([])
                setResultNav({ selectionOffset: 0, maxOffset: 0 })
            }
        }
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (searchResults && searchResults.length) {
            if (e.key === 'Enter') {
                const {
                    properties: {
                        // @ts-ignore
                        coordinates: { latitude, longitude }
                    }
                } = searchResults[resultNav.selectionOffset]
                saveSelection(searchResults[resultNav.selectionOffset])
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
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
            <div
                id='suggestions'
                className={`list-group list-group-flush rounded rounded-3 position-absolute shadow w-75 ${searchResults?.length && searchResultsVisible ? '' : 'd-none'}`}
                style={{ zIndex: 1000 }}
            >
                {searchResults?.map((feature, i) => (
                    <Link
                        key={feature.id}
                        className={`list-group-item list-group-item-action text-bg-dark bg-opacity-75 border-dark border-opacity-50 search-result ${i === resultNav.selectionOffset ? 'active' : ''}`}
                        to={`/forecast/${feature.properties?.coordinates.latitude},${feature.properties?.coordinates.longitude}`}
                        onClick={() => saveSelection(feature)}
                    >
                        {feature.properties?.full_address}
                    </Link>
                ))}
            </div>
        </div>
    )
}
