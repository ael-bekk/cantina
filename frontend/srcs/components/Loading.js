import styles from '../../styles/Loading.module.scss';

export default function () {
    return (
        <div id="loading" className={styles["loading-wrapp"]}>
            <div className={styles.inner}>
                <div className={styles.fill}></div>
            </div>
        </div>
    )
}