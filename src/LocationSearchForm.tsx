export interface LocationSearchFormProps {
    location: string
    onSearchFieldChange: (value: string) => void
    onSearchButtonClick: (location: string) => void
}

export default function LocationSearchForm({
    location,
    onSearchFieldChange,
    onSearchButtonClick
}: LocationSearchFormProps) {
    return (
        <div className={'container mt-3 bg-transparent'}>
            <div className='input-group mb-3'>
                <input
                    type='text'
                    name={'search'}
                    className='form-control rounded-pill rounded-end text-bg-dark bg-opacity-25 border-light border-opacity-10 shadow'
                    placeholder='Location'
                    aria-label='Location'
                    aria-describedby='search'
                    onChange={(e) => onSearchFieldChange(e.target.value)}
                />
                <button
                    className='btn btn-primary rounded-pill rounded-start shadow border-light border-opacity-25'
                    type='button'
                    id='search'
                    style={{ borderLeft: 'none' }}
                    onClick={() => onSearchButtonClick(location)}
                >
                    <i className={'bi bi-search'} />
                </button>
            </div>
        </div>
    )
}
