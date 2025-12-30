import { useEffect, useRef } from 'react'
import Autocomplete from 'bootstrap5-autocomplete'

export interface LocationSearchFormProps {
    location?: string
    onSearchFieldChange?: (value: string) => void
    onSearchButtonClick: (location: string) => void
}

export default function LocationSearchForm({ onSearchButtonClick }: LocationSearchFormProps) {
    const searchInputRef = useRef(null)

    useEffect(() => {
        const savedQueries = localStorage.getItem('savedQueries')
        let items
        if (savedQueries) {
            items = JSON.parse(savedQueries)
        } else {
            items = []
        }

        Autocomplete.init('#geocodingSearch', {
            items,
            onSelectItem() {
                if (searchInputRef.current) {
                    console.log((searchInputRef.current as HTMLInputElement).value)
                }
            }
        })
        console.log('autocomplete initialized')
    }, [])

    const onSearch = () => {
        if (searchInputRef.current) {
            const q = (searchInputRef.current as HTMLInputElement).value
            const savedQueries = localStorage.getItem('savedQueries')
            console.log((searchInputRef.current as HTMLInputElement).value)

            let queries
            if (savedQueries) {
                queries = JSON.parse(savedQueries)
            } else {
                queries = []
            }

            queries.push({ label: q, value: q })
            localStorage.setItem('savedQueries', JSON.stringify(queries))
            onSearchButtonClick(q)
        }
    }

    return (
        <div className={'container mt-3 bg-transparent'}>
            <div className='input-group mb-3'>
                <input
                    ref={searchInputRef}
                    id={'geocodingSearch'}
                    type='text'
                    name={'search'}
                    className='form-control autocomplete rounded-pill rounded-end text-bg-dark bg-opacity-25 border-light border-opacity-10 shadow'
                    placeholder='Search for a city or place'
                    aria-label='Location'
                    aria-describedby='search'
                    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                    // @ts-ignore
                    onKeyDown={(e: KeyboardEvent) => {
                        if (e.key === 'Enter') {
                            onSearch()
                        }
                    }}
                />
                <button
                    className='btn btn-primary rounded-pill rounded-start shadow border-light border-opacity-25'
                    type='button'
                    id='search'
                    style={{ borderLeft: 'none' }}
                    onClick={onSearch}
                >
                    <i className={'bi bi-search'} />
                </button>
            </div>
        </div>
    )
}
