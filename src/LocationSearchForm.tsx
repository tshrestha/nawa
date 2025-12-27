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
                    className='form-control rounded-pill rounded-end opacity-50 shadow'
                    placeholder='Location'
                    aria-label='Location'
                    aria-describedby='search'
                    onChange={(e) => onSearchFieldChange(e.target.value)}
                />
                <button
                    className='btn btn-primary rounded-pill rounded-start shadow'
                    type='button'
                    id='search'
                    onClick={() => onSearchButtonClick(location)}
                >
                    <i className={'bi bi-search'} />
                </button>
            </div>
        </div>
    )
}
