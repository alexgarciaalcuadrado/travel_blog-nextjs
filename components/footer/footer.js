import styles from "../footer/footer.module.scss"

const Footer = () => {

    return(
        <div className={styles.footer}>
            <div>
                <p>This blog was made by <a href="https://www.linkedin.com/in/alexander-garc%C3%ADa-409918201/">Alexander García</a> in 2022</p>
            </div>
            <div>
                <p>Feel free to use this repository and code as you wish</p>
            </div>
            <div>
                <p>Icons made by <a href="https://www.flaticon.com/authors/itim2101" title="itim2101"> itim2101 </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p>
            </div>
        </div>
    )
}

export default Footer;