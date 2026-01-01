import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { debounce } from 'lodash-es'

import type { Feature } from 'geojson'
import { geocodeSearch } from './lib/geocoding.ts'
import { addItem, getItem, setItem, savedSelectionsCollectionKey } from './lib/cache.ts'

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
                    setSearchResults(cached)
                } else {
                    debounce(() => {
                        geocodeSearch(query).then(({ features }) => {
                            setItem(query, features)
                            setSearchResults(features)
                        })
                    }, 300)()
                }
            } else {
                setSearchResults([])
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

    useEffect(() => {
        if (searchResults && searchResults.length) {
            setResultNav({ ...resultNav, maxOffset: searchResults.length - 1 })
        }
    }, [searchResults])

    return (
        <div className={'container position-fixed bottom-0 start-0 pb-4 z-3'}>
            <div
                id='suggestions'
                className={`list-group list-group-flush rounded rounded-3 position-absolute start-0 bottom-100 pb-1 w-100 ${searchResults?.length && searchResultsVisible ? '' : 'd-none'}`}
                style={{ zIndex: 1000 }}
            >
                {searchResults?.map((feature, i) => (
                    <Link
                        key={feature.id}
                        className={`list-group-item list-group-item-action search-result ${i === resultNav.selectionOffset ? 'active' : ''}`}
                        to={`/forecast/${feature.properties?.coordinates.latitude},${feature.properties?.coordinates.longitude}`}
                        onClick={() => saveSelection(feature)}
                        tabIndex={0}
                    >
                        {feature.properties?.full_address}
                    </Link>
                ))}
            </div>
            <input
                autoComplete={'off'}
                ref={searchInputRef}
                id={'geocodingSearch'}
                type='search'
                name={'search'}
                className='form-control form-control-lg rounded-pill border-4 shadow-sm'
                placeholder='Search for a city or place'
                aria-label='Location'
                aria-describedby='search'
                onChange={onChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </div>
    )
}
