import styles from "./Footer.module.scss";

function Footer(){
    return (
        <footer
            className={`${styles.footer} d-flex flex-row align-items-center justify-content-center p-20 bg-primary pt-4`}
        >
            <p>Copyright © 2024 CookWithOpenAi, Inc.</p>
        </footer>
    )
}

export default Footer;