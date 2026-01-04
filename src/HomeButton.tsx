import { NavLink } from 'react-router'

export default function HomeButton() {
    return (
        <NavLink to={'/'} className={'btn btn-light btn-lg rounded-pill shadow'}>
            <i className={'bi bi-arrow-left'}></i>
        </NavLink>
    )
}
