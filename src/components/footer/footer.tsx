import styles from "./footer.module.css";
type Props = {
    points: number;
};
export const Footer = (props: Props) => {
    return (
        <footer className={styles["footer-container"]}>
            <div className={styles["footer-score-container"]}>
                <h1>{props.points}</h1>
            </div>
        </footer>
    );
};
