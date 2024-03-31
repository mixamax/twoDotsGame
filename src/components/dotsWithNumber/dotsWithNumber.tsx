import styles from "./dotsWithNumber.module.css";

type Props = {
    color: string;
    number: number;
};
export const DotsWithNumber = ({ color, number }: Props) => {
    return (
        <div className={styles["dot-in-header-container"]}>
            <div
                style={{ backgroundColor: color }}
                className={styles["dot-in-header"]}
            ></div>
            <span className={styles["dot-in-header-number"]}>{number}</span>
        </div>
    );
};
