import styles from "./scoreField.module.css";

type Props = {
    moveNumber: number;
};
export const ScoreField = (props: Props) => {
    return (
        <div className={styles["scoreField-container"]}>
            <span className={styles["score-number"]}>{props.moveNumber}</span>
            <span className={styles["score-title"]}>moves</span>
        </div>
    );
};
