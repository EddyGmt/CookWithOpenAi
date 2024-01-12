import {Navbar} from "react-bootstrap";
import styles from "./Header.module.scss";
import {Link} from "react-router-dom";

export function Header() {
    return (
        <header className={`${styles.header} d-flex flex-row align-items-center bg-light`}>
            <i className="fa-solid fa-bars mr-15"></i>
            <div className="flex-fill">
                <img src="" alt="logo cookchef"/>
            </div>
            <ul>
                <Link to="/profil">Profil</Link>

            </ul>
        </header>
    )
}

export default Header;