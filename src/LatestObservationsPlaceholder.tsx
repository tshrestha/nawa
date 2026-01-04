export default function LatestObservationsPlaceholder() {
    return (
        <div className={'mt-4 mb-4 text-center'}>
            <h1 className={'display-6 placeholder-glow'}>
                <span className={'placeholder placeholder-lg col-6'} />
            </h1>
            <h2 className={'mb-0 placeholder-glow'}>
                <span className={'placeholder placeholder-lg col-6'} />
            </h2>
            <div className={'d-flex justify-content-center align-items-center'}>
                <div className='col text-end placeholder-glow m-2'>
                    <h1 className={'display-1 align-middle placeholder-glow'}>
                        <span className={'placeholder placeholder-lg col-5'} />
                    </h1>
                </div>
                <div className='col text-start m-2'>
                    <h1 className={'display-1 align-middle placeholder-glow'}>
                        <span className={'placeholder placeholder-lg col-5'} />
                    </h1>
                </div>
            </div>
            <h2 className={'placeholder-glow col'}>
                <span className={'placeholder placeholder-lg col-6'} />
            </h2>
        </div>
    )
}
