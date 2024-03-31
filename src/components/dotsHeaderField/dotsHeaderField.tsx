import styles from "./dotsHeaderField.module.css";
import { DotsWithNumber } from "../dotsWithNumber/dotsWithNumber";
import { scoreDot } from "../../game/elements";

type Props = {
    listOfDots: scoreDot[];
};

export const DotsHeaderField = (props: Props) => {
    return (
        <div className={styles["dots-header-field-container"]}>
            {props.listOfDots.map((dot, index) => (
                <DotsWithNumber
                    key={index}
                    color={dot.color}
                    number={dot.startScore}
                />
            ))}
        </div>
    );
};
