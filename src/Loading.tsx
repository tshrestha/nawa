export default function Loading() {
    return (
        <div className={'position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center z-3'}>
            <div className='container'>
                <div className={'card rounded-4 p-4 text-bg-dark bg-opacity-75 border-dark shadow-sm'}>
                    <h1 className={'display-5'}>Loading</h1>
                    {/* @ts-ignore */}
                    <div
                        className='progress'
                        role='progressbar'
                        aria-label='Basic example'
                        aria-valuenow='100'
                        aria-valuemin='0'
                        aria-valuemax='100'
                    >
                        <div
                            className='progress-bar progress-bar-striped progress-bar-animated'
                            style={{ width: '100%' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
